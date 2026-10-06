'use client';

// src/components/sections/LocalCacheManager.tsx
// Local Database (IndexedDB) manager for persistent caching with clean and delete options

import { useEffect, useState, useCallback } from 'react';
import { useApp, useT } from '@/context/AppContext';
import {
  saveAppStateToDb,
  loadAppStateFromDb,
  getDbStorageStats,
  clearLocalDb,
  deleteEntireDatabase,
} from '@/lib/local-db';
import { formatFileSize } from '@/lib/pdf-reader';
import { Database, Save, RotateCcw, Trash2, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function LocalCacheManager() {
  const { state, loadState, resetWorkspace } = useApp();
  const t = useT();

  const [stats, setStats] = useState<{
    totalBytes: number;
    fileCount: number;
    hasProject: boolean;
    savedAt: string | null;
  }>({ totalBytes: 0, fileCount: 0, hasProject: false, savedAt: null });

  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [justRestored, setJustRestored] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const refreshStats = useCallback(async () => {
    try {
      const s = await getDbStorageStats();
      setStats(s);
    } catch {
      // Ignore
    }
  }, []);

  // Initial stats load on mount
  useEffect(() => {
    let mounted = true;
    getDbStorageStats()
      .then(s => {
        if (mounted) setStats(s);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Auto-cache to IndexedDB with debounce when user modifies workspace
  useEffect(() => {
    if (!state.requirementsFile && state.uploadedFiles.length === 0) return;

    let mounted = true;
    const timer = setTimeout(async () => {
      try {
        await saveAppStateToDb(state);
        const s = await getDbStorageStats();
        if (mounted) setStats(s);
      } catch {
        // Auto-save silently handles errors
      }
    }, 1200);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [state]);

  const handleManualSave = async () => {
    setSaving(true);
    try {
      await saveAppStateToDb(state);
      await refreshStats();
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch {
      // Handled
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async () => {
    try {
      const loaded = await loadAppStateFromDb();
      if (!loaded) return;

      loadState({
        requirementsFile: loaded.requirementsFile,
        uploadedFiles: loaded.uploadedFiles,
      });

      setJustRestored(true);
      setTimeout(() => setJustRestored(false), 2000);
    } catch {
      // Handled
    }
  };

  const handleClearCache = async () => {
    try {
      await clearLocalDb();
      await deleteEntireDatabase();
      resetWorkspace();
      await refreshStats();
      setShowConfirmDelete(false);
    } catch {
      // Handled
    }
  };

  const hasDataToSave = state.requirementsFile !== null || state.uploadedFiles.length > 0;
  const hasCachedData = stats.fileCount > 0 || stats.hasProject;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Storage Indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 10px',
          background: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          fontSize: '11px',
          color: 'var(--text-secondary)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
          <Database size={13} color="var(--color-primary-600)" />
          Local DB Cache:
        </span>
        <span style={{ fontWeight: 700, color: hasCachedData ? 'var(--color-primary-700)' : 'var(--text-muted)' }}>
          {hasCachedData ? `${formatFileSize(stats.totalBytes)} (${stats.fileCount} files)` : 'Empty (0 B)'}
        </span>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasDataToSave || saving}
          onClick={handleManualSave}
          icon={justSaved ? <CheckCircle2 size={13} color="var(--color-success-text)" /> : <Save size={13} />}
          style={{ justifyContent: 'center', fontSize: '11px' }}
        >
          {justSaved ? 'Saved to DB!' : t('save_project')}
        </Button>

        <Button
          variant="secondary"
          size="sm"
          disabled={!hasCachedData}
          onClick={handleRestore}
          icon={justRestored ? <CheckCircle2 size={13} color="var(--color-success-text)" /> : <RotateCcw size={13} />}
          style={{ justifyContent: 'center', fontSize: '11px' }}
        >
          {justRestored ? 'Restored!' : 'Restore DB'}
        </Button>
      </div>

      {/* Delete / Clean Cache Button */}
      {hasCachedData && (
        <button
          type="button"
          onClick={() => setShowConfirmDelete(true)}
          style={{
            background: 'none',
            border: '1px dashed var(--color-error-border)',
            borderRadius: 'var(--radius-md)',
            padding: '5px 10px',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--color-error-text)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            transition: 'all var(--duration-base)',
          }}
        >
          <Trash2 size={12} />
          Clean & Delete Local DB
        </button>
      )}

      {/* Confirmation Modal */}
      {showConfirmDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowConfirmDelete(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--surface-0)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              maxWidth: '400px',
              width: '100%',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="var(--color-error-text)" />
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Clean & Delete Local DB?
                </span>
              </div>
              <button
                onClick={() => setShowConfirmDelete(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              This will delete all cached PDF files ({stats.fileCount} files, {formatFileSize(stats.totalBytes)}) and reset your current workspace. This action cannot be undone.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border-default)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearCache}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-error-text)',
                  border: 'none',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <Trash2 size={13} />
                Delete & Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
