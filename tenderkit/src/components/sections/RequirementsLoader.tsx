'use client';

// src/components/sections/RequirementsLoader.tsx
// Load and display requirements.json — professional card design

import { useCallback, useState } from 'react';
import { Upload, X, FileJson, CheckCircle2, Building2, Calendar, Hash, User } from 'lucide-react';
import { useApp, useT } from '@/context/AppContext';
import { parseRequirementsFile } from '@/lib/requirements-parser';

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
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}
    >
      {/* Card header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: rf ? '1px solid var(--border-subtle)' : 'none',
          background: rf ? 'var(--surface-1)' : 'var(--surface-0)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-md)',
              background: rf ? 'var(--color-success-bg)' : 'var(--color-primary-50)',
              border: `1px solid ${rf ? 'var(--color-success-border)' : 'var(--color-primary-200)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {rf ? (
              <CheckCircle2 size={16} color="var(--color-success-text)" strokeWidth={2} />
            ) : (
              <FileJson size={16} color="var(--color-primary-600)" strokeWidth={2} />
            )}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {t('load_requirements')}
            </div>
            {rf && (
              <div style={{ fontSize: '11px', color: 'var(--color-success-text)', lineHeight: 1.2, fontWeight: 500 }}>
                {rf.requirements.length} documents loaded
              </div>
            )}
          </div>
        </div>
        {rf && (
          <button
            onClick={clearRequirements}
            style={{
              background: 'none',
              border: '1px solid var(--border-default)',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '5px 10px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              fontWeight: 500,
              transition: 'all var(--duration-base)',
            }}
            aria-label="Clear requirements"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>

      <div style={{ padding: '16px 20px' }}>
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
              gap: '10px',
              padding: '28px 16px',
              border: `2px dashed ${isDragging ? 'var(--color-primary-500)' : 'var(--border-default)'}`,
              borderRadius: 'var(--radius-md)',
              background: isDragging
                ? 'var(--color-primary-50)'
                : 'var(--surface-1)',
              cursor: 'pointer',
              transition: 'all var(--duration-base) var(--ease-default)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-lg)',
                background: isDragging ? 'var(--color-primary-100)' : 'var(--surface-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all var(--duration-base)',
              }}
            >
              <Upload
                size={22}
                color={isDragging ? 'var(--color-primary-600)' : 'var(--color-primary-500)'}
                strokeWidth={1.5}
              />
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
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
                padding: '5px 14px',
                background: 'var(--color-primary-50)',
                border: '1px solid var(--color-primary-200)',
                borderRadius: 'var(--radius-full)',
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
          // Tender info cards
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Tender title */}
            <div
              style={{
                padding: '12px 14px',
                background: `linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-primary-100) 100%)`,
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-primary-200)',
              }}
            >
              <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary-800)', margin: 0, lineHeight: 1.3 }}>
                {rf.tender.title}
              </p>
            </div>

            {/* Meta grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { icon: Hash,      label: t('tender_id'),           value: rf.tender.tender_id },
                { icon: Building2, label: t('procuring_entity'),    value: rf.tender.procuring_entity },
                { icon: User,      label: t('bidder'),              value: rf.tender.bidder },
                { icon: Calendar,  label: t('submission_deadline'), value: rf.tender.submission_deadline },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  style={{
                    padding: '10px 12px',
                    background: 'var(--surface-1)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Icon size={12} color="var(--text-muted)" strokeWidth={2} />
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {label}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: '12px',
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
            <X size={14} />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
