'use client';

// src/context/AppContext.tsx
// Central state management for TenderKit

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

import {
  AppState,
  Language,
  Theme,
  RequirementsFile,
  UploadedFile,
  RequirementState,
} from '@/types';
import { computeAllStatuses } from '@/lib/validator';
import { detectDuplicates } from '@/lib/pdf-reader';

// ─── Actions ────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_REQUIREMENTS'; payload: RequirementsFile }
  | { type: 'CLEAR_REQUIREMENTS' }
  | { type: 'ADD_FILES'; payload: UploadedFile[] }
  | { type: 'REMOVE_FILE'; payload: string }           // fileId
  | { type: 'UPDATE_FILE'; payload: UploadedFile }
  | { type: 'SET_MATCH'; payload: { reqId: string; fileId: string | null } }
  | { type: 'SET_EXPIRY'; payload: { reqId: string; date: string | null } }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadStoredTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = localStorage.getItem('tenderkit_theme') as 'light' | 'dark' | null;
    return stored === 'dark' ? 'dark' : 'light';
  } catch { return 'light'; }
}

function loadStoredLanguage(): 'en' | 'bn' {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = localStorage.getItem('tenderkit_lang') as 'en' | 'bn' | null;
    return stored === 'bn' ? 'bn' : 'en';
  } catch { return 'en'; }
}

// ─── Initial State ───────────────────────────────────────────────────────────

const initialState: AppState = {
  requirementsFile: null,
  uploadedFiles: [],
  requirementStates: [],
  language: 'en',
  theme: 'light',
};

// ─── Helper: recompute requirement states ───────────────────────────────────

function recomputeStates(
  state: AppState,
  overrides?: {
    requirementsFile?: RequirementsFile | null;
    uploadedFiles?: UploadedFile[];
    matches?: Map<string, string | null>;
    expiryDates?: Map<string, string | null>;
  }
): RequirementState[] {
  const rf = overrides?.requirementsFile ?? state.requirementsFile;
  if (!rf) return [];

  const files = overrides?.uploadedFiles ?? state.uploadedFiles;

  // Build maps from current requirement states
  const matches: Map<string, string | null> =
    overrides?.matches ??
    new Map(state.requirementStates.map(s => [s.requirement.id, s.matchedFileId]));

  const expiryDates: Map<string, string | null> =
    overrides?.expiryDates ??
    new Map(state.requirementStates.map(s => [s.requirement.id, s.expiryDate]));

  return computeAllStatuses(
    rf.requirements,
    matches,
    expiryDates,
    rf.tender.submission_deadline,
    files
  );
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_REQUIREMENTS': {
      const rf = action.payload;
      // Initialize all requirement states with empty matches
      const matches = new Map<string, string | null>(
        rf.requirements.map(r => [r.id, null])
      );
      const expiryDates = new Map<string, string | null>(
        rf.requirements.map(r => [r.id, null])
      );
      const requirementStates = computeAllStatuses(
        rf.requirements,
        matches,
        expiryDates,
        rf.tender.submission_deadline,
        state.uploadedFiles
      );
      return { ...state, requirementsFile: rf, requirementStates };
    }

    case 'CLEAR_REQUIREMENTS':
      return { ...state, requirementsFile: null, requirementStates: [] };

    case 'ADD_FILES': {
      const combined = detectDuplicates([...state.uploadedFiles, ...action.payload]);
      const requirementStates = recomputeStates(state, { uploadedFiles: combined });
      return { ...state, uploadedFiles: combined, requirementStates };
    }

    case 'REMOVE_FILE': {
      const fileId = action.payload;
      const remaining = detectDuplicates(
        state.uploadedFiles.filter(f => f.id !== fileId)
      );
      // Clear any matches pointing to this file
      const matches = new Map(
        state.requirementStates.map(s => [
          s.requirement.id,
          s.matchedFileId === fileId ? null : s.matchedFileId,
        ])
      );
      const expiryDates = new Map(
        state.requirementStates.map(s => [s.requirement.id, s.expiryDate])
      );
      const requirementStates = recomputeStates(state, {
        uploadedFiles: remaining,
        matches,
        expiryDates,
      });
      return { ...state, uploadedFiles: remaining, requirementStates };
    }

    case 'UPDATE_FILE': {
      const updated = detectDuplicates(
        state.uploadedFiles.map(f => (f.id === action.payload.id ? action.payload : f))
      );
      const requirementStates = recomputeStates(state, { uploadedFiles: updated });
      return { ...state, uploadedFiles: updated, requirementStates };
    }

    case 'SET_MATCH': {
      const { reqId, fileId } = action.payload;
      const matches = new Map(
        state.requirementStates.map(s => [s.requirement.id, s.matchedFileId])
      );
      const expiryDates = new Map(
        state.requirementStates.map(s => [s.requirement.id, s.expiryDate])
      );

      // If assigning a new file, clear its previous assignment
      if (fileId !== null) {
        for (const [id, fid] of matches) {
          if (fid === fileId && id !== reqId) {
            matches.set(id, null);
          }
        }
      }
      matches.set(reqId, fileId);

      // Clear expiry when unmatching
      if (fileId === null) {
        expiryDates.set(reqId, null);
      }

      const requirementStates = recomputeStates(state, { matches, expiryDates });
      return { ...state, requirementStates };
    }

    case 'SET_EXPIRY': {
      const { reqId, date } = action.payload;
      const expiryDates = new Map(
        state.requirementStates.map(s => [s.requirement.id, s.expiryDate])
      );
      expiryDates.set(reqId, date);
      const requirementStates = recomputeStates(state, { expiryDates });
      return { ...state, requirementStates };
    }

    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };

    case 'SET_THEME':
      return { ...state, theme: action.payload };

    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  setRequirements: (rf: RequirementsFile) => void;
  clearRequirements: () => void;
  addFiles: (files: UploadedFile[]) => void;
  removeFile: (fileId: string) => void;
  updateFile: (file: UploadedFile) => void;
  setMatch: (reqId: string, fileId: string | null) => void;
  setExpiry: (reqId: string, date: string | null) => void;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // Load persisted theme/lang before first render to avoid flash
  const [state, dispatch] = useReducer(reducer, initialState, () => ({
    ...initialState,
    theme: loadStoredTheme(),
    language: loadStoredLanguage(),
  }));

  // Sync theme attribute to <html> on mount and changes
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  const setRequirements = useCallback((rf: RequirementsFile) => {
    dispatch({ type: 'SET_REQUIREMENTS', payload: rf });
  }, []);

  const clearRequirements = useCallback(() => {
    dispatch({ type: 'CLEAR_REQUIREMENTS' });
  }, []);

  const addFiles = useCallback((files: UploadedFile[]) => {
    dispatch({ type: 'ADD_FILES', payload: files });
  }, []);

  const removeFile = useCallback((fileId: string) => {
    dispatch({ type: 'REMOVE_FILE', payload: fileId });
  }, []);

  const updateFile = useCallback((file: UploadedFile) => {
    dispatch({ type: 'UPDATE_FILE', payload: file });
  }, []);

  const setMatch = useCallback((reqId: string, fileId: string | null) => {
    dispatch({ type: 'SET_MATCH', payload: { reqId, fileId } });
  }, []);

  const setExpiry = useCallback((reqId: string, date: string | null) => {
    dispatch({ type: 'SET_EXPIRY', payload: { reqId, date } });
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
    try { localStorage.setItem('tenderkit_lang', lang); } catch {}
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('tenderkit_theme', theme); } catch {}
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      setRequirements,
      clearRequirements,
      addFiles,
      removeFile,
      updateFile,
      setMatch,
      setExpiry,
      setLanguage,
      setTheme,
    }),
    [
      state,
      setRequirements,
      clearRequirements,
      addFiles,
      removeFile,
      updateFile,
      setMatch,
      setExpiry,
      setLanguage,
      setTheme,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// Convenience hook for translations
import { getTranslation } from '@/lib/i18n';

export function useT() {
  const { state } = useApp();
  return getTranslation(state.language);
}
