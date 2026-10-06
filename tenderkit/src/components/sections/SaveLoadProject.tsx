'use client';

// src/components/sections/SaveLoadProject.tsx
// BONUS: Save/restore project state via localStorage

import { useApp, useT } from '@/context/AppContext';
import { Save, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

const STORAGE_KEY = 'tenderkit_project';

interface SavedProject {
  requirementsFile: unknown;
  matches: Array<{ reqId: string; fileId: string | null }>;
  expiryDates: Array<{ reqId: string; date: string | null }>;
  // Note: we cannot save File objects to localStorage — only metadata
}

export function SaveLoadProject() {
  const { state } = useApp();
  const t = useT();
  const [saved, setSaved] = useState(false);

  const saveProject = () => {
    if (!state.requirementsFile) return;

    const project: SavedProject = {
      requirementsFile: state.requirementsFile,
      matches: state.requirementStates.map(s => ({
        reqId: s.requirement.id,
        fileId: s.matchedFileId,
      })),
      expiryDates: state.requirementStates.map(s => ({
        reqId: s.requirement.id,
        date: s.expiryDate,
      })),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // localStorage quota exceeded — silently fail
    }
  };

  if (!state.requirementsFile) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={saveProject}
      icon={saved ? <Save size={14} color="var(--color-success-text)" /> : <Save size={14} />}
      style={{
        width: '100%',
        justifyContent: 'center',
        color: saved ? 'var(--color-success-text)' : 'var(--text-secondary)',
      }}
    >
      {saved ? `✓ ${t('save_project')}` : t('save_project')}
    </Button>
  );
}
