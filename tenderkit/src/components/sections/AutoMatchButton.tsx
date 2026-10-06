'use client';

// src/components/sections/AutoMatchButton.tsx
// BONUS: Auto-match files to requirements based on filename similarity

import { useApp, useT } from '@/context/AppContext';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

/**
 * Score filename similarity against a requirement title.
 * Simple bag-of-words overlap score — O(n*m) where n,m are word counts.
 * Returns 0-1 score.
 */
function similarity(filename: string, title: string): number {
  const normalize = (s: string) =>
    s.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);

  const fileWords = new Set(normalize(filename));
  const titleWords = normalize(title);

  if (titleWords.length === 0 || fileWords.size === 0) return 0;

  const matches = titleWords.filter(w => fileWords.has(w)).length;
  return matches / titleWords.length;
}

export function AutoMatchButton() {
  const { state, setMatch } = useApp();
  const t = useT();
  const [matchCount, setMatchCount] = useState<number | null>(null);

  const canAutoMatch =
    state.requirementsFile !== null && state.uploadedFiles.length > 0;

  const autoMatch = () => {
    if (!state.requirementsFile) return;

    // Build score matrix: O(files * requirements)
    const scores: Array<{ fileId: string; reqId: string; score: number }> = [];

    for (const file of state.uploadedFiles) {
      if (file.isDuplicate || file.loadError) continue;
      for (const req of state.requirementsFile.requirements) {
        const score = Math.max(
          similarity(file.name, req.title_en),
          similarity(file.name, req.title_bn)
        );
        if (score > 0.3) {
          scores.push({ fileId: file.id, reqId: req.id, score });
        }
      }
    }

    // Greedy assignment: highest-score pairs first
    scores.sort((a, b) => b.score - a.score);
    const usedFiles = new Set<string>();
    const usedReqs = new Set<string>();
    let count = 0;

    const alreadyMatched = new Set(
      state.requirementStates
        .filter(s => s.matchedFileId !== null)
        .map(s => s.requirement.id)
    );

    for (const { fileId, reqId } of scores) {
      if (usedFiles.has(fileId) || usedReqs.has(reqId)) continue;
      if (alreadyMatched.has(reqId)) continue;

      setMatch(reqId, fileId);
      usedFiles.add(fileId);
      usedReqs.add(reqId);
      count++;
    }

    setMatchCount(count);
  };

  if (!canAutoMatch) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <Button
        variant="secondary"
        size="sm"
        onClick={autoMatch}
        icon={<Wand2 size={13} />}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {t('auto_match')}
      </Button>
      {matchCount !== null && (
        <p style={{ fontSize: '11px', color: 'var(--color-success-text)', textAlign: 'center', margin: 0, fontWeight: 600 }}>
          ✓ {matchCount} matched automatically
        </p>
      )}
    </div>
  );
}
