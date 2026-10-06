'use client';

// src/components/sections/RequirementsList.tsx
// Show all requirements with status, match controls, and expiry date inputs

import { useApp, useT } from '@/context/AppContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { RequirementState } from '@/types';
import { Calendar, Link2, Link2Off } from 'lucide-react';

export function RequirementsList() {
  const { state, setMatch, setExpiry } = useApp();
  const t = useT();

  const rf = state.requirementsFile;
  if (!rf) {
    return (
      <div
        style={{
          background: 'var(--surface-0)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px' }}>
          {t('requirements')}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
          {t('load_json_first')}
        </p>
      </div>
    );
  }

  // Already sorted by validator — sort again here for display clarity
  const sorted = [...state.requirementStates].sort(
    (a, b) => a.requirement.order - b.requirement.order
  );

  return (
    <div
      style={{
        background: 'var(--surface-0)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
          {t('requirements')}
        </h2>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-success-text)' }}>
            ✓ {sorted.filter(s => s.status === 'ok').length}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {sorted.length}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sorted.map((reqState, idx) => (
          <RequirementRow
            key={reqState.requirement.id}
            reqState={reqState}
            index={idx + 1}
            onSetMatch={setMatch}
            onSetExpiry={setExpiry}
          />
        ))}
      </div>
    </div>
  );
}

interface RequirementRowProps {
  reqState: RequirementState;
  index: number;
  onSetMatch: (reqId: string, fileId: string | null) => void;
  onSetExpiry: (reqId: string, date: string | null) => void;
}

function RequirementRow({ reqState, index, onSetMatch, onSetExpiry }: RequirementRowProps) {
  const { state } = useApp();
  const t = useT();
  const { requirement, matchedFileId, expiryDate, status } = reqState;

  const lang = state.language;
  const title = lang === 'bn' ? requirement.title_bn : requirement.title_en;

  // Files available for matching: unmatched files + currently matched file
  // A duplicate file can only be matched if no other file with same hash is already matched elsewhere
  const availableFiles = state.uploadedFiles.filter(f => {
    if (f.id === matchedFileId) return true; // already matched here
    if (f.loadError) return false;           // error files not available
    
    // Check if this file is a duplicate — if its original is already matched somewhere, block
    if (f.isDuplicate && f.duplicateOfId) {
      const originalIsMatched = state.requirementStates.some(
        s => s.matchedFileId === f.duplicateOfId && s.requirement.id !== requirement.id
      );
      if (originalIsMatched) return false;
    }
    
    // Check if already matched to a different requirement
    const isMatchedElsewhere = state.requirementStates.some(
      s => s.matchedFileId === f.id && s.requirement.id !== requirement.id
    );
    return !isMatchedElsewhere;
  });

  const isBlocking = status === 'missing' || status === 'expiry_needed' || status === 'expired';

  return (
    <div
      style={{
        padding: '12px',
        background: isBlocking ? 'var(--color-error-bg)' : status === 'ok' ? 'var(--color-success-bg)' : 'var(--surface-1)',
        border: `1px solid ${
          isBlocking
            ? 'var(--color-error-border)'
            : status === 'ok'
            ? 'var(--color-success-border)'
            : 'var(--border-subtle)'
        }`,
        borderRadius: 'var(--radius-md)',
        transition: 'all var(--duration-slow) var(--ease-out)',
      }}
    >
      {/* Row header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
        {/* Order badge */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '22px',
            height: '22px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-primary-600)',
            color: 'white',
            fontSize: '11px',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {index}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>
            {title}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '11px',
                padding: '1px 6px',
                borderRadius: 'var(--radius-full)',
                background: requirement.mandatory ? 'var(--color-primary-100)' : 'var(--surface-3)',
                color: requirement.mandatory ? 'var(--color-primary-800)' : 'var(--text-muted)',
                fontWeight: 500,
              }}
            >
              {requirement.mandatory ? t('mandatory') : t('optional')}
            </span>
            <StatusBadge status={status} size="sm" />
          </div>
        </div>
      </div>

      {/* Match selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link2 size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <select
            value={matchedFileId ?? ''}
            onChange={e => onSetMatch(requirement.id, e.target.value || null)}
            aria-label={`Match file to ${title}`}
            style={{
              flex: 1,
              padding: '6px 10px',
              fontSize: '13px',
              background: 'var(--surface-0)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="">{t('no_file')}</option>
            {availableFiles.map(f => (
              <option key={f.id} value={f.id}>
                {f.isDuplicate ? '⚠ ' : ''}{f.name}
                {f.pageCount !== null ? ` (${f.pageCount}p)` : ''}
              </option>
            ))}
          </select>

          {matchedFileId && (
            <button
              onClick={() => onSetMatch(requirement.id, null)}
              aria-label={t('unmatch')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <Link2Off size={14} />
            </button>
          )}
        </div>

        {/* Expiry date input — shown when has_expiry AND file is matched */}
        {requirement.has_expiry && matchedFileId && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <input
              type="date"
              value={expiryDate ?? ''}
              onChange={e => onSetExpiry(requirement.id, e.target.value || null)}
              aria-label={`${t('expiry_date')} for ${title}`}
              style={{
                flex: 1,
                padding: '6px 10px',
                fontSize: '13px',
                background: 'var(--surface-0)',
                color: 'var(--text-primary)',
                border: `1px solid ${status === 'expired' || status === 'expiry_needed' ? 'var(--color-error-border)' : 'var(--border-default)'}`,
                borderRadius: 'var(--radius-md)',
                outline: 'none',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
