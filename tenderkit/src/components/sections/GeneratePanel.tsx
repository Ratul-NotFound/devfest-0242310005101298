'use client';

// src/components/sections/GeneratePanel.tsx
// Status summary + generate/download button — premium card design

import { useState, useCallback } from 'react';
import { AlertTriangle, Download, Package, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useApp, useT } from '@/context/AppContext';
import { getBlockingStates } from '@/lib/validator';
import { buildPackage, downloadPdf } from '@/lib/pdf-builder';

export function GeneratePanel() {
  const { state } = useApp();
  const t = useT();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const blockingStates = getBlockingStates(state.requirementStates);
  const canGenerate =
    state.requirementsFile !== null &&
    blockingStates.length === 0 &&
    state.requirementStates.some(s => s.status === 'ok');

  const generate = useCallback(async () => {
    if (!state.requirementsFile || !canGenerate) return;
    setGenerating(true);
    setError(null);
    setDone(false);

    try {
      const fileMap = new Map<string, File>(
        state.uploadedFiles.map(f => [f.id, f.file])
      );

      const bytes = await buildPackage({
        tender: state.requirementsFile.tender,
        states: state.requirementStates,
        uploadedFileMap: fileMap,
        includeIndex: true,
      });

      const filename = `${state.requirementsFile.tender.tender_id}_Package.pdf`;
      downloadPdf(bytes, filename);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PDF generation failed');
    } finally {
      setGenerating(false);
    }
  }, [state, canGenerate]);

  const lang = state.language;
  const okCount    = state.requirementStates.filter(s => s.status === 'ok').length;
  const npCount    = state.requirementStates.filter(s => s.status === 'not_provided').length;
  const totalCount = state.requirementStates.length;

  return (
    <div
      className="interactive-card"
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
            background: canGenerate ? 'var(--color-success-bg)' : 'var(--color-primary-50)',
            border: `1px solid ${canGenerate ? 'var(--color-success-border)' : 'var(--color-primary-200)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Package
            size={16}
            color={canGenerate ? 'var(--color-success-text)' : 'var(--color-primary-600)'}
            strokeWidth={2}
          />
        </div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {t('generate_package')}
        </div>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Status */}
        {!state.requirementsFile ? (
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              margin: 0,
              padding: '12px',
              background: 'var(--surface-1)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center',
            }}
          >
            {t('load_json_first')}
          </p>
        ) : state.uploadedFiles.length === 0 ? (
          <div
            style={{
              padding: '12px 14px',
              background: 'var(--color-primary-50)',
              border: '1px solid var(--color-primary-200)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Package size={14} color="var(--color-primary-700)" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary-800)' }}>
                Step 2: Upload PDF Files
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--color-primary-700)', margin: 0, lineHeight: 1.4 }}>
              Upload your tender PDFs on the right to match each required document. All 8 mandatory items need a matching file.
            </p>
          </div>
        ) : blockingStates.length > 0 ? (
          <div
            style={{
              padding: '12px 14px',
              background: 'var(--color-error-bg)',
              border: '1px solid var(--color-error-border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              maxHeight: '260px',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <AlertTriangle size={14} color="var(--color-error-text)" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-error-text)' }}>
                {t('blocking_issues')} &middot; {blockingStates.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {blockingStates.map(s => {
                const docTitle = lang === 'bn' ? s.requirement.title_bn : s.requirement.title_en;
                const reason =
                  s.status === 'missing'
                    ? t('missing_mandatory')
                    : s.status === 'expiry_needed'
                    ? t('needs_expiry_date')
                    : t('document_expired');
                return (
                  <div
                    key={s.requirement.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '12px',
                      color: 'var(--color-error-text)',
                    }}
                  >
                    <XCircle size={12} style={{ flexShrink: 0, marginTop: '1px' }} />
                    <span>
                      <strong>{docTitle}</strong>: {reason}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '10px 14px',
              background: 'var(--color-success-bg)',
              border: '1px solid var(--color-success-border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={14} color="var(--color-success-text)" />
            <span style={{ fontSize: '13px', color: 'var(--color-success-text)', fontWeight: 600 }}>
              {t('package_ready')}
            </span>
          </div>
        )}

        {/* Progress stats */}
        {state.requirementsFile && totalCount > 0 && (
          <div>
            {/* Progress bar */}
            <div style={{ marginBottom: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Progress
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: okCount === totalCount ? 'var(--color-success-text)' : 'var(--text-muted)' }}>
                  {okCount}/{totalCount}
                </span>
              </div>
              <div
                style={{
                  height: '6px',
                  background: 'var(--surface-3)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${totalCount > 0 ? (okCount / totalCount) * 100 : 0}%`,
                    background: blockingStates.length > 0
                      ? 'var(--color-error-text)'
                      : okCount === totalCount
                      ? 'var(--color-success-text)'
                      : 'var(--color-primary-500)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width var(--duration-slow) var(--ease-out)',
                  }}
                />
              </div>
            </div>

            {/* Stat chips */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              {[
                { label: 'Ready',     value: okCount,              color: 'var(--color-success-text)', bg: 'var(--color-success-bg)', border: 'var(--color-success-border)' },
                { label: 'Optional',  value: npCount,              color: 'var(--color-neutral-text)', bg: 'var(--surface-2)',         border: 'var(--border-subtle)' },
                { label: 'Blocked',   value: blockingStates.length, color: blockingStates.length > 0 ? 'var(--color-error-text)' : 'var(--text-muted)', bg: blockingStates.length > 0 ? 'var(--color-error-bg)' : 'var(--surface-2)', border: blockingStates.length > 0 ? 'var(--color-error-border)' : 'var(--border-subtle)' },
              ].map(({ label, value, color, bg, border }) => (
                <div
                  key={label}
                  style={{
                    padding: '8px',
                    background: bg,
                    border: `1px solid ${border}`,
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '20px', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: '10px', color, fontWeight: 500, marginTop: '2px', opacity: 0.8 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={generate}
          disabled={!canGenerate || generating}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '13px 20px',
            background: canGenerate && !generating
              ? 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)'
              : 'var(--surface-3)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            fontWeight: 700,
            color: canGenerate && !generating ? 'white' : 'var(--text-muted)',
            cursor: canGenerate && !generating ? 'pointer' : 'not-allowed',
            letterSpacing: '0.01em',
            boxShadow: canGenerate && !generating ? 'var(--shadow-primary)' : 'none',
            transition: 'all var(--duration-base) var(--ease-default)',
          }}
          onMouseEnter={e => {
            if (canGenerate && !generating) {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow-primary-lg)';
            }
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = '';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = canGenerate && !generating ? 'var(--shadow-primary)' : 'none';
          }}
        >
          {generating ? (
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <Download size={16} />
          )}
          {generating ? t('generating') : done ? t('download_package') : t('generate_package')}
        </button>

        {/* Success */}
        {done && !generating && (
          <div
            style={{
              padding: '10px 14px',
              background: 'var(--color-success-bg)',
              border: '1px solid var(--color-success-border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: 'var(--color-success-text)',
              fontWeight: 500,
            }}
          >
            <CheckCircle2 size={14} />
            ✓ {state.requirementsFile?.tender.tender_id}_Package.pdf downloaded
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              padding: '10px 14px',
              background: 'var(--color-error-bg)',
              border: '1px solid var(--color-error-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              color: 'var(--color-error-text)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <XCircle size={14} />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
