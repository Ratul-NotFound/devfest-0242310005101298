'use client';

// src/components/sections/FileUploader.tsx
// PDF file upload with drag-drop, validation, page count, and duplicate detection

import { useCallback, useRef, useState } from 'react';
import { Upload, File, X, AlertTriangle, Copy } from 'lucide-react';
import { useApp, useT } from '@/context/AppContext';
import { processFile, formatFileSize } from '@/lib/pdf-reader';
import { Button } from '@/components/ui/Button';
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

      // Reject non-PDFs
      const pdfs = fileArray.filter(f => {
        if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
          newErrors.push(`${f.name}: ${t('error_not_pdf')}`);
          return false;
        }
        return true;
      });

      // Check file count
      if (state.uploadedFiles.length + pdfs.length > MAX_FILES) {
        newErrors.push(t('error_too_many'));
        setErrors(newErrors);
        return;
      }

      // Check total size
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

      // Create placeholder entries immediately for responsiveness
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

      // Process each file asynchronously (page count + hash)
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
          {t('upload_files')}
        </h2>
        {state.uploadedFiles.length > 0 && (
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {state.uploadedFiles.length}/{MAX_FILES} files · {formatFileSize(totalSize)}
          </span>
        )}
      </div>

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
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          padding: '20px',
          border: `2px dashed ${isDragging ? 'var(--color-primary-500)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-md)',
          background: isDragging ? 'var(--color-primary-50)' : 'var(--surface-1)',
          cursor: 'pointer',
          transition: 'all var(--duration-base) var(--ease-default)',
          textAlign: 'center',
        }}
      >
        <Upload size={24} color="var(--color-primary-500)" strokeWidth={1.5} />
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
          {t('drop_pdfs_here')}
        </p>
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
            padding: '10px 12px',
            background: 'var(--color-error-bg)',
            border: '1px solid var(--color-error-border)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          {errors.map((err, i) => (
            <p key={i} style={{ fontSize: '13px', color: 'var(--color-error-text)', margin: i > 0 ? '4px 0 0' : 0 }}>
              {err}
            </p>
          ))}
        </div>
      )}

      {/* File list */}
      {state.uploadedFiles.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t('uploaded_files')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '280px', overflowY: 'auto' }}>
            {state.uploadedFiles.map(file => (
              <FileRow key={file.id} file={file} onRemove={() => removeFile(file.id)} />
            ))}
          </div>
        </div>
      )}

      {processing && (
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
          {t('loading')}
        </p>
      )}
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
        padding: '8px 10px',
        background: hasError ? 'var(--color-error-bg)' : 'var(--surface-1)',
        border: `1px solid ${hasError ? 'var(--color-error-border)' : file.isDuplicate ? 'var(--color-warning-border)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)',
        transition: 'all var(--duration-base) var(--ease-default)',
      }}
    >
      <File
        size={16}
        color={hasError ? 'var(--color-error-text)' : 'var(--color-primary-500)'}
        strokeWidth={1.5}
        style={{ flexShrink: 0 }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: '13px',
            fontWeight: 500,
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
            : t('loading')}
        </p>
      </div>

      {/* Duplicate badge */}
      {file.isDuplicate && (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            padding: '2px 6px',
            background: 'var(--color-warning-bg)',
            border: '1px solid var(--color-warning-border)',
            borderRadius: 'var(--radius-full)',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--color-warning-text)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          <Copy size={10} />
          {t('duplicate')}
        </span>
      )}

      {/* Error badge */}
      {file.loadError && (
        <AlertTriangle size={14} color="var(--color-error-text)" style={{ flexShrink: 0 }} />
      )}

      <button
        onClick={onRemove}
        aria-label={`${t('remove')} ${file.name}`}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          transition: 'color var(--duration-base)',
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
