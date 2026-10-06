'use client';

// src/components/sections/FileUploader.tsx
// PDF file upload with drag-drop, validation, page count, and duplicate detection

import { useCallback, useRef, useState } from 'react';
import { Upload, FileText, X, AlertTriangle, Copy, CloudUpload, CheckCircle } from 'lucide-react';
import { useApp, useT } from '@/context/AppContext';
import { processFile, formatFileSize } from '@/lib/pdf-reader';
import { UploadedFile } from '@/types';

const MAX_FILES = 30;
const MAX_TOTAL_BYTES = 50 * 1024 * 1024; // 50 MB

export function FileUploader() {
  const { state, addFiles, removeFile, updateFile } = useApp();
  const t = useT();
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const newErrors: string[] = [];

      const pdfs = fileArray.filter(f => {
        if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
          newErrors.push(`${f.name}: ${t('error_not_pdf')}`);
          return false;
        }
        return true;
      });

      if (state.uploadedFiles.length + pdfs.length > MAX_FILES) {
        newErrors.push(t('error_too_many'));
        setErrors(newErrors);
        return;
      }

      const currentSize = state.uploadedFiles.reduce((s, f) => s + f.sizeBytes, 0);
      const newSize = pdfs.reduce((s, f) => s + f.size, 0);
      if (currentSize + newSize > MAX_TOTAL_BYTES) {
        newErrors.push(t('error_too_large'));
        setErrors(newErrors);
        return;
      }

      setErrors(newErrors);
      if (pdfs.length === 0) return;

      setProcessing(true);

      const placeholders: UploadedFile[] = pdfs.map(f => ({
        id: crypto.randomUUID(),
        file: f,
        name: f.name,
        sizeBytes: f.size,
        pageCount: null,
        hash: null,
        isDuplicate: false,
      }));

      addFiles(placeholders);

      for (const placeholder of placeholders) {
        try {
          const processed = await processFile(placeholder.file);
          updateFile({ ...processed, id: placeholder.id });
        } catch {
          updateFile({ ...placeholder, loadError: 'corrupted' });
        }
      }

      setProcessing(false);
    },
    [state.uploadedFiles, addFiles, updateFile, t]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = '';
  };

  const totalSize = state.uploadedFiles.reduce((s, f) => s + f.sizeBytes, 0);
  const hasFiles  = state.uploadedFiles.length > 0;

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
              background: hasFiles ? 'var(--color-success-bg)' : 'var(--color-primary-50)',
              border: `1px solid ${hasFiles ? 'var(--color-success-border)' : 'var(--color-primary-200)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {hasFiles
              ? <CheckCircle size={16} color="var(--color-success-text)" strokeWidth={2} />
              : <CloudUpload size={16} color="var(--color-primary-600)" strokeWidth={2} />
            }
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {t('upload_files')}
            </div>
            {hasFiles && (
              <div style={{ fontSize: '11px', color: 'var(--color-success-text)', fontWeight: 500, lineHeight: 1.2 }}>
                {state.uploadedFiles.length} file{state.uploadedFiles.length !== 1 ? 's' : ''} · {formatFileSize(totalSize)}
              </div>
            )}
          </div>
        </div>
        {hasFiles && (
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {state.uploadedFiles.length}/{MAX_FILES}
          </span>
        )}
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
          aria-label={t('drop_pdfs_here')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '16px 18px',
            border: `2px dashed ${isDragging ? 'var(--color-primary-500)' : 'var(--border-default)'}`,
            borderRadius: 'var(--radius-md)',
            background: isDragging ? 'var(--color-primary-50)' : 'var(--surface-1)',
            cursor: 'pointer',
            transition: 'all var(--duration-base) var(--ease-default)',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              background: isDragging ? 'var(--color-primary-100)' : 'var(--surface-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all var(--duration-base)',
            }}
          >
            <Upload
              size={20}
              color={isDragging ? 'var(--color-primary-600)' : 'var(--color-primary-500)'}
              strokeWidth={1.5}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>
              {t('drop_pdfs_here')}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
              PDF only &bull; max 50 MB total &bull; click anywhere to browse
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-primary-700)',
                background: 'var(--color-primary-100)',
                border: '1px solid var(--color-primary-300)',
                borderRadius: 'var(--radius-md)',
                padding: '6px 12px',
                cursor: 'pointer',
              }}
            >
              {t('browse_pdfs')}
            </button>
            <button
              type="button"
              disabled={processing}
              onClick={async (e) => {
                e.stopPropagation();
                setProcessing(true);
                try {
                  const { fetchSamplePdfs } = await import('@/lib/sample-loader');
                  const sampleFiles = await fetchSamplePdfs();
                  if (sampleFiles.length > 0) {
                    await processFiles(sampleFiles);
                  }
                } catch {
                  // Fallback handled
                } finally {
                  setProcessing(false);
                }
              }}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'white',
                background: 'var(--color-primary-600)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '6px 12px',
                cursor: processing ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {t('load_sample_pdfs')}
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            multiple
            onChange={onInputChange}
            style={{ display: 'none' }}
            aria-hidden="true"
          />
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div
            style={{
              padding: '10px 14px',
              background: 'var(--color-error-bg)',
              border: '1px solid var(--color-error-border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            {errors.map((err, i) => (
              <p
                key={i}
                style={{
                  fontSize: '13px',
                  color: 'var(--color-error-text)',
                  margin: i > 0 ? '4px 0 0' : 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <AlertTriangle size={12} style={{ flexShrink: 0 }} />
                {err}
              </p>
            ))}
          </div>
        )}

        {/* File list */}
        {hasFiles && (
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-muted)',
                margin: '0 0 8px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {t('uploaded_files')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '320px', overflowY: 'auto' }}>
              {state.uploadedFiles.map(file => (
                <FileRow key={file.id} file={file} onRemove={() => removeFile(file.id)} />
              ))}
            </div>
          </div>
        )}

        {processing && (
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
            ⏳ {t('loading')}
          </p>
        )}
      </div>
    </div>
  );
}

function FileRow({ file, onRemove }: { file: UploadedFile; onRemove: () => void }) {
  const t = useT();
  const hasError = !!file.loadError;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '9px 12px',
        background: hasError
          ? 'var(--color-error-bg)'
          : file.isDuplicate
          ? 'var(--color-warning-bg)'
          : 'var(--surface-1)',
        border: `1px solid ${
          hasError
            ? 'var(--color-error-border)'
            : file.isDuplicate
            ? 'var(--color-warning-border)'
            : 'var(--border-subtle)'
        }`,
        borderRadius: 'var(--radius-md)',
        transition: 'all var(--duration-base) var(--ease-default)',
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 'var(--radius-sm)',
          background: hasError
            ? 'var(--color-error-border)'
            : 'var(--color-primary-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <FileText
          size={14}
          color={hasError ? 'var(--color-error-text)' : 'var(--color-primary-700)'}
          strokeWidth={2}
        />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {file.name}
        </p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
          {file.pageCount !== null
            ? `${file.pageCount} ${t('pages')} · ${formatFileSize(file.sizeBytes)}`
            : file.loadError
            ? (file.loadError === 'encrypted' ? t('error_encrypted') : t('error_corrupted'))
            : '⏳ ' + t('loading')}
        </p>
      </div>

      {/* Duplicate badge */}
      {file.isDuplicate && (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            padding: '2px 8px',
            background: 'var(--color-warning-bg)',
            border: '1px solid var(--color-warning-border)',
            borderRadius: 'var(--radius-full)',
            fontSize: '10px',
            fontWeight: 700,
            color: 'var(--color-warning-text)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          <Copy size={9} />
          {t('duplicate')}
        </span>
      )}

      {/* Error icon */}
      {hasError && (
        <AlertTriangle size={14} color="var(--color-error-text)" style={{ flexShrink: 0 }} />
      )}

      <button
        onClick={onRemove}
        aria-label={`${t('remove')} ${file.name}`}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '5px',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          transition: 'color var(--duration-base)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-error-text)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
