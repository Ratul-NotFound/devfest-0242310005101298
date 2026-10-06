'use client';

// src/components/sections/RequirementsList.tsx
// Requirements with status, match controls, and expiry inputs — premium design

import { useApp, useT } from '@/context/AppContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { RequirementState } from '@/types';
import { Calendar, Link2, Link2Off, ListChecks, FileText } from 'lucide-react';

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
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--surface-1)',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface-2)',
              border: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ListChecks size={16} color="var(--text-muted)" strokeWidth={2} />
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {t('requirements')}
          </div>
        </div>
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 'var(--radius-xl)',
              background: 'var(--surface-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}
          >
            <FileText size={24} color="var(--text-muted)" strokeWidth={1.5} />
          </div>
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 4px' }}>
            No requirements loaded
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            {t('load_json_first')}
          </p>
        </div>
      </div>
    );
  }

  const sorted = [...state.requirementStates].sort(
    (a, b) => a.requirement.order - b.requirement.order
  );

  const okCount = sorted.filter(s => s.status === 'ok').length;

  return (
    <div
      style={{
        background: 'var(--surface-0)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--surface-1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary-50)',
              border: '1px solid var(--color-primary-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ListChecks size={16} color="var(--color-primary-600)" strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {t('requirements')}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.2 }}>
              Match PDF files to each required document
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            background: okCount === sorted.length ? 'var(--color-success-bg)' : 'var(--surface-2)',
            border: `1px solid ${okCount === sorted.length ? 'var(--color-success-border)' : 'var(--border-subtle)'}`,
            borderRadius: 'var(--radius-full)',
          }}
        >
          <span
            style={{
              fontSize: '13px',
              fontWeight: 800,
              color: okCount === sorted.length ? 'var(--color-success-text)' : 'var(--text-primary)',
            }}
          >
            {okCount}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ {sorted.length}</span>
        </div>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
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

  const lang  = state.language;
  const title = lang === 'bn' ? requirement.title_bn : requirement.title_en;

  const isOk       = status === 'ok';

  const availableFiles = state.uploadedFiles.filter(f => {
    if (f.id === matchedFileId) return true;
    if (f.loadError) return false;
    if (f.isDuplicate && f.duplicateOfId) {
      const originalIsMatched = state.requirementStates.some(
        s => s.matchedFileId === f.duplicateOfId && s.requirement.id !== requirement.id
      );
      if (originalIsMatched) return false;
    }
    const isMatchedElsewhere = state.requirementStates.some(
      s => s.matchedFileId === f.id && s.requirement.id !== requirement.id
    );
    return !isMatchedElsewhere;
  });

  return (
    <div
      style={{
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${
          status === 'expired'     ? 'var(--color-error-border)'
          : isOk                   ? 'var(--color-success-border)'
          : 'var(--border-subtle)'
        }`,
        background:
          status === 'expired'     ? 'var(--color-error-bg)'
          : isOk                   ? 'var(--color-success-bg)'
          : 'var(--surface-0)',
        overflow: 'hidden',
        transition: 'all var(--duration-slow) var(--ease-out)',
      }}
    >
      {/* Row header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          padding: '10px 12px',
          borderBottom: '1px solid var(--border-subtle)',
          background: isOk ? 'rgba(255,255,255,0.4)' : 'var(--surface-1)',
        }}
      >
        {/* Order badge */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '22px',
            height: '22px',
            borderRadius: 'var(--radius-full)',
            background: status === 'expired'
              ? 'var(--color-error-text)'
              : isOk
              ? 'var(--color-success-text)'
              : 'var(--color-primary-700)',
            color: 'white',
            fontSize: '11px',
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {index}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px', lineHeight: 1.3 }}>
            {title}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '10px',
                padding: '1px 7px',
                borderRadius: 'var(--radius-full)',
                background: requirement.mandatory ? 'var(--color-primary-100)' : 'var(--surface-3)',
                color: requirement.mandatory ? 'var(--color-primary-700)' : 'var(--text-muted)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {requirement.mandatory ? t('mandatory') : t('optional')}
            </span>
            <StatusBadge status={status} size="sm" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* File match selector */}
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
              border: `1px solid ${matchedFileId ? 'var(--color-primary-400)' : 'var(--border-default)'}`,
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'var(--font-body)',
              transition: 'border-color var(--duration-base)',
            }}
          >
            <option value="">{t('no_file')}</option>
            {availableFiles.map(f => (
              <option key={f.id} value={f.id}>
                {f.isDuplicate ? '⚠ ' : ''}{f.name}{f.pageCount !== null ? ` (${f.pageCount}p)` : ''}
              </option>
            ))}
          </select>

          {matchedFileId && (
            <button
              onClick={() => onSetMatch(requirement.id, null)}
              aria-label={t('unmatch')}
              style={{
                background: 'none',
                border: '1px solid var(--border-default)',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '6px 8px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
                transition: 'all var(--duration-base)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = 'var(--color-error-bg)';
                el.style.borderColor = 'var(--color-error-border)';
                el.style.color = 'var(--color-error-text)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = 'none';
                el.style.borderColor = 'var(--border-default)';
                el.style.color = 'var(--text-muted)';
              }}
            >
              <Link2Off size={13} />
            </button>
          )}
        </div>

        {/* Expiry date */}
        {requirement.has_expiry && matchedFileId && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar
              size={13}
              color={status === 'expired' || status === 'expiry_needed' ? 'var(--color-error-text)' : 'var(--text-muted)'}
              style={{ flexShrink: 0 }}
            />
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
                border: `1px solid ${
                  status === 'expired' || status === 'expiry_needed'
                    ? 'var(--color-error-border)'
                    : expiryDate
                    ? 'var(--color-success-border)'
                    : 'var(--border-default)'
                }`,
                borderRadius: 'var(--radius-md)',
                outline: 'none',
                fontFamily: 'var(--font-body)',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
