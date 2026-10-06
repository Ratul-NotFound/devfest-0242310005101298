// src/lib/pdf-reader.ts
// Read PDF metadata (page count) and compute SHA-256 hash for duplicate detection
// Uses pdf.js (pdfjs-dist) and Web Crypto API

import { UploadedFile } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Lazy-load pdf.js worker to avoid SSR issues
let pdfjsLib: typeof import('pdfjs-dist') | null = null;

async function getPdfjsLib() {
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist');
    // Set worker source — use CDN worker for compatibility
    if (typeof window !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    }
  }
  return pdfjsLib;
}

/**
 * Compute SHA-256 hash of file bytes.
 * O(n) where n = file size. Uses Web Crypto API (browser-native, no library needed).
 * Returns hex string.
 */
export async function computeFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  // Convert ArrayBuffer to hex string — O(32) for SHA-256 output
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Get page count from a PDF file using pdf.js.
 * Returns page count or throws with error type.
 */
export async function getPdfPageCount(file: File): Promise<number> {
  const pdfjs = await getPdfjsLib();
  const buffer = await file.arrayBuffer();

  const loadingTask = pdfjs.getDocument({
    data: buffer,
    // Disable range requests and streaming for local files
    disableRange: true,
    disableStream: true,
  });

  const pdf = await loadingTask.promise;
  return pdf.numPages;
}

/**
 * Process a File into an UploadedFile object.
 * Handles encrypted/corrupted PDFs gracefully.
 */
export async function processFile(file: File): Promise<UploadedFile> {
  const id = uuidv4();

  // Hash is computed from raw bytes regardless of PDF validity
  let hash: string | null = null;
  let pageCount: number | null = null;
  let loadError: string | undefined;

  try {
    hash = await computeFileHash(file);
  } catch {
    hash = null;
  }

  try {
    pageCount = await getPdfPageCount(file);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes('password')) {
      loadError = 'encrypted';
    } else {
      loadError = 'corrupted';
    }
  }

  return {
    id,
    file,
    name: file.name,
    sizeBytes: file.size,
    pageCount,
    hash,
    isDuplicate: false,
    loadError,
  };
}

/**
 * Detect duplicates among uploaded files using hash map.
 * O(n) time — one pass to build hash → id map, second pass to mark duplicates.
 * Returns updated files with isDuplicate and duplicateOfId set.
 */
export function detectDuplicates(files: UploadedFile[]): UploadedFile[] {
  // Map from hash to first file id — O(1) lookup
  const hashToId = new Map<string, string>();

  return files.map(file => {
    if (!file.hash) return { ...file, isDuplicate: false };

    const existing = hashToId.get(file.hash);
    if (existing) {
      return { ...file, isDuplicate: true, duplicateOfId: existing };
    }
    hashToId.set(file.hash, file.id);
    return { ...file, isDuplicate: false, duplicateOfId: undefined };
  });
}

/**
 * Format file size for display.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
