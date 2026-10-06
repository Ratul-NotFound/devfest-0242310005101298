'use client';

// src/components/sections/GeneratePanel.tsx
// Shows blocking issues and generate/download button

import { useState, useCallback } from 'react';
import { AlertTriangle, Download, Package, CheckCircle2 } from 'lucide-react';
import { useApp, useT } from '@/context/AppContext';
import { getBlockingStates } from '@/lib/validator';
import { buildPackage, downloadPdf } from '@/lib/pdf-builder';
import { Button } from '@/components/ui/Button';

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
      // Build file map from uploaded files
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
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Package size={18} color="var(--color-primary-600)" strokeWidth={1.5} />
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
          {t('generate_package')}
        </h2>
      </div>

      {/* Blocking issues */}
      {!state.requirementsFile ? (
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
          {t('load_json_first')}
        </p>
      ) : blockingStates.length > 0 ? (
        <div
          style={{
            padding: '12px',
            background: 'var(--color-error-bg)',
            border: '1px solid var(--color-error-border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={14} color="var(--color-error-text)" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-error-text)' }}>
              {t('blocking_issues')} ({blockingStates.length})
            </span>
          </div>
          {blockingStates.map(s => {
            const docTitle = lang === 'bn' ? s.requirement.title_bn : s.requirement.title_en;
            const reason =
              s.status === 'missing'
                ? t('missing_mandatory')
                : s.status === 'expiry_needed'
                ? t('needs_expiry_date')
                : t('document_expired');
            return (
              <div key={s.requirement.id} style={{ display: 'flex', gap: '8px', paddingLeft: '20px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-error-text)' }}>•</span>
                <span style={{ fontSize: '12px', color: 'var(--color-error-text)' }}>
                  <strong>{docTitle}</strong>: {reason}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            padding: '10px 12px',
            background: 'var(--color-success-bg)',
            border: '1px solid var(--color-success-border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={14} color="var(--color-success-text)" />
          <span style={{ fontSize: '13px', color: 'var(--color-success-text)', fontWeight: 500 }}>
            {t('package_ready')}
          </span>
        </div>
      )}

      {/* Summary stats */}
      {state.requirementsFile && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          {[
            {
              label: 'OK',
              value: state.requirementStates.filter(s => s.status === 'ok').length,
              color: 'var(--color-success-text)',
            },
            {
              label: t('status_not_provided'),
              value: state.requirementStates.filter(s => s.status === 'not_provided').length,
              color: 'var(--color-neutral-text)',
            },
            {
              label: t('blocking_issues'),
              value: blockingStates.length,
              color: blockingStates.length > 0 ? 'var(--color-error-text)' : 'var(--text-muted)',
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                padding: '8px',
                background: 'var(--surface-1)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '20px', fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Generate button */}
      <Button
        variant="primary"
        size="lg"
        onClick={generate}
        disabled={!canGenerate}
        loading={generating}
        icon={<Download size={18} />}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {generating ? t('generating') : done ? t('download_package') : t('generate_package')}
      </Button>

      {/* Success message */}
      {done && !generating && (
        <div
          style={{
            padding: '10px 12px',
            background: 'var(--color-success-bg)',
            border: '1px solid var(--color-success-border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={14} color="var(--color-success-text)" />
          <span style={{ fontSize: '13px', color: 'var(--color-success-text)', fontWeight: 500 }}>
            ✓ {state.requirementsFile?.tender.tender_id}_Package.pdf downloaded
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            padding: '10px 12px',
            background: 'var(--color-error-bg)',
            border: '1px solid var(--color-error-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            color: 'var(--color-error-text)',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
