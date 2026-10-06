'use client';

// src/components/sections/RequirementsLoader.tsx
// Load and display requirements.json

import { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useApp, useT } from '@/context/AppContext';
import { parseRequirementsFile } from '@/lib/requirements-parser';
import { Button } from '@/components/ui/Button';

export function RequirementsLoader() {
  const { state, setRequirements, clearRequirements } = useApp();
  const t = useT();
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      const result = await parseRequirementsFile(file);
      if (result.success) {
        setRequirements(result.data);
      } else {
        setError(t(result.error === 'invalid_json' ? 'error_invalid_json' : 'error_invalid_format'));
      }
    },
    [setRequirements, t]
  );

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const rf = state.requirementsFile;

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
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
          {t('load_requirements')}
        </h2>
        {rf && (
          <button
            onClick={clearRequirements}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Clear requirements"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {!rf ? (
        // Drop zone
        <label
          htmlFor="json-upload"
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '24px 16px',
            border: `2px dashed ${isDragging ? 'var(--color-primary-500)' : 'var(--border-default)'}`,
            borderRadius: 'var(--radius-md)',
            background: isDragging ? 'var(--color-primary-50)' : 'var(--surface-1)',
            cursor: 'pointer',
            transition: 'all var(--duration-base) var(--ease-default)',
            textAlign: 'center',
          }}
        >
          <Upload size={28} color="var(--color-primary-500)" strokeWidth={1.5} />
          <div>
            <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 2px' }}>
              {t('drop_json_here')}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
              {t('load_requirements_desc')}
            </p>
          </div>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-primary-600)',
              textDecoration: 'underline',
            }}
          >
            {t('browse_file')}
          </span>
          <input
            id="json-upload"
            type="file"
            accept=".json,application/json"
            onChange={onFileInput}
            style={{ display: 'none' }}
          />
        </label>
      ) : (
        // Tender summary
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              padding: '12px',
              background: 'var(--color-primary-50)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-primary-100)',
            }}
          >
            <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary-800)', margin: '0 0 8px' }}>
              {rf.tender.title}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
              {[
                [t('tender_id'), rf.tender.tender_id],
                [t('procuring_entity'), rf.tender.procuring_entity],
                [t('bidder'), rf.tender.bidder],
                [t('submission_deadline'), rf.tender.submission_deadline],
              ].map(([label, value]) => (
                <div key={label}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>{label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            {rf.requirements.length} {t('requirements').toLowerCase()} loaded
          </p>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: '12px',
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
