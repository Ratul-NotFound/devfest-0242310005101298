// src/lib/local-db.ts
// Local IndexedDB caching engine for TenderKit
// Stores binary PDF files, requirements metadata, matches, and expiry dates locally in browser

import { AppState, UploadedFile, RequirementsFile } from '@/types';

const DB_NAME = 'TenderKit_LocalDB';
const DB_VERSION = 1;

const STORES = {
  FILES: 'cached_files',
  PROJECT: 'project_state',
};

export interface CachedFileRecord {
  id: string;
  name: string;
  sizeBytes: number;
  pageCount: number | null;
  hash: string | null;
  isDuplicate: boolean;
  duplicateOfId?: string;
  loadError?: string;
  blob: Blob;
}

export interface CachedProjectRecord {
  id: string; // 'current'
  requirementsFile: RequirementsFile | null;
  matches: Array<{ reqId: string; fileId: string | null }>;
  expiryDates: Array<{ reqId: string; date: string | null }>;
  savedAt: string;
}

/**
 * Open or initialize the IndexedDB database.
 */
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORES.FILES)) {
        db.createObjectStore(STORES.FILES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.PROJECT)) {
        db.createObjectStore(STORES.PROJECT, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save complete application state (including binary PDF files) to IndexedDB.
 */
export async function saveAppStateToDb(state: AppState): Promise<void> {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORES.FILES, STORES.PROJECT], 'readwrite');
    const fileStore = tx.objectStore(STORES.FILES);
    const projectStore = tx.objectStore(STORES.PROJECT);

    // 1. Clear old files and write current files
    fileStore.clear();
    for (const f of state.uploadedFiles) {
      const record: CachedFileRecord = {
        id: f.id,
        name: f.name,
        sizeBytes: f.sizeBytes,
        pageCount: f.pageCount,
        hash: f.hash,
        isDuplicate: f.isDuplicate,
        duplicateOfId: f.duplicateOfId,
        loadError: f.loadError,
        blob: f.file,
      };
      fileStore.put(record);
    }

    // 2. Write project metadata
    const projectRecord: CachedProjectRecord = {
      id: 'current',
      requirementsFile: state.requirementsFile,
      matches: state.requirementStates.map(s => ({
        reqId: s.requirement.id,
        fileId: s.matchedFileId,
      })),
      expiryDates: state.requirementStates.map(s => ({
        reqId: s.requirement.id,
        date: s.expiryDate,
      })),
      savedAt: new Date().toISOString(),
    };
    projectStore.put(projectRecord);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Load complete application state from IndexedDB.
 */
export async function loadAppStateFromDb(): Promise<{
  requirementsFile: RequirementsFile | null;
  uploadedFiles: UploadedFile[];
  matches: Map<string, string | null>;
  expiryDates: Map<string, string | null>;
  savedAt: string;
} | null> {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORES.FILES, STORES.PROJECT], 'readonly');
    const fileStore = tx.objectStore(STORES.FILES);
    const projectStore = tx.objectStore(STORES.PROJECT);

    const getProject = projectStore.get('current');
    const getFiles = fileStore.getAll();

    tx.oncomplete = () => {
      const project: CachedProjectRecord | undefined = getProject.result;
      const fileRecords: CachedFileRecord[] = getFiles.result || [];

      if (!project && fileRecords.length === 0) {
        resolve(null);
        return;
      }

      const uploadedFiles: UploadedFile[] = fileRecords.map(r => ({
        id: r.id,
        file: new File([r.blob], r.name, { type: 'application/pdf' }),
        name: r.name,
        sizeBytes: r.sizeBytes,
        pageCount: r.pageCount,
        hash: r.hash,
        isDuplicate: r.isDuplicate,
        duplicateOfId: r.duplicateOfId,
        loadError: r.loadError,
      }));

      const matches = new Map<string, string | null>(
        project?.matches?.map(m => [m.reqId, m.fileId]) ?? []
      );

      const expiryDates = new Map<string, string | null>(
        project?.expiryDates?.map(e => [e.reqId, e.date]) ?? []
      );

      resolve({
        requirementsFile: project?.requirementsFile ?? null,
        uploadedFiles,
        matches,
        expiryDates,
        savedAt: project?.savedAt ?? new Date().toISOString(),
      });
    };

    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Get current storage usage statistics in IndexedDB.
 */
export async function getDbStorageStats(): Promise<{
  totalBytes: number;
  fileCount: number;
  hasProject: boolean;
  savedAt: string | null;
}> {
  try {
    const db = await openDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORES.FILES, STORES.PROJECT], 'readonly');
      const fileStore = tx.objectStore(STORES.FILES);
      const projectStore = tx.objectStore(STORES.PROJECT);

      const getProject = projectStore.get('current');
      const getFiles = fileStore.getAll();

      tx.oncomplete = () => {
        const project: CachedProjectRecord | undefined = getProject.result;
        const fileRecords: CachedFileRecord[] = getFiles.result || [];

        const totalBytes = fileRecords.reduce((acc, f) => acc + (f.sizeBytes || 0), 0);

        resolve({
          totalBytes,
          fileCount: fileRecords.length,
          hasProject: !!project?.requirementsFile,
          savedAt: project?.savedAt ?? null,
        });
      };

      tx.onerror = () => reject(tx.error);
    });
  } catch {
    return { totalBytes: 0, fileCount: 0, hasProject: false, savedAt: null };
  }
}

/**
 * Clear all cached data inside IndexedDB stores.
 */
export async function clearLocalDb(): Promise<void> {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORES.FILES, STORES.PROJECT], 'readwrite');
    tx.objectStore(STORES.FILES).clear();
    tx.objectStore(STORES.PROJECT).clear();

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Drop the entire IndexedDB database.
 */
export function deleteEntireDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve();
      return;
    }

    const req = window.indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    req.onblocked = () => resolve();
  });
}
