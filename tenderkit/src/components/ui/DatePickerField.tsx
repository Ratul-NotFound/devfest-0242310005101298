'use client';

// src/components/ui/DatePickerField.tsx
// Interactive date picker with calendar popup trigger and quick presets (Bilingual EN/BN)

import { useRef } from 'react';
import { useT } from '@/context/AppContext';
import { Calendar as CalendarIcon, X, CheckCircle2, AlertTriangle, CalendarDays } from 'lucide-react';

interface DatePickerFieldProps {
  value: string | null;
  onChange: (date: string | null) => void;
  submissionDeadline?: string;
  isExpired?: boolean;
  isNeeded?: boolean;
  label?: string;
}

export function DatePickerField({
  value,
  onChange,
  submissionDeadline,
  isExpired,
  isNeeded,
  label,
}: DatePickerFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useT();

  const displayLabel = label || t('expiry_date');

  const openCalendar = () => {
    if (inputRef.current) {
      if (typeof inputRef.current.showPicker === 'function') {
        try {
          inputRef.current.showPicker();
        } catch {
          inputRef.current.focus();
        }
      } else {
        inputRef.current.focus();
      }
    }
  };

  const setPreset = (dateStr: string) => {
    onChange(dateStr);
  };

  const nextYearDate = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <CalendarDays size={12} color="var(--color-primary-600)" />
          {displayLabel}:
        </span>
        {value && submissionDeadline && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: isExpired ? 'var(--color-error-text)' : 'var(--color-success-text)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {isExpired ? (
              <>
                <AlertTriangle size={11} /> {t('expired_before_deadline')}
              </>
            ) : (
              <>
                <CheckCircle2 size={11} /> {t('valid_on_deadline')}
              </>
            )}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Calendar Picker Input Container */}
        <div
          onClick={openCalendar}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && openCalendar()}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 10px',
            background: 'var(--surface-0)',
            border: `1px solid ${
              isExpired || isNeeded
                ? 'var(--color-error-border)'
                : value
                ? 'var(--color-success-border)'
                : 'var(--border-default)'
            }`,
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            transition: 'all var(--duration-base)',
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openCalendar();
            }}
            title={displayLabel}
            style={{
              background: 'var(--color-primary-50)',
              border: '1px solid var(--color-primary-200)',
              borderRadius: 'var(--radius-sm)',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-primary-700)',
            }}
          >
            <CalendarIcon size={14} />
          </button>

          <input
            ref={inputRef}
            type="date"
            value={value ?? ''}
            onChange={e => onChange(e.target.value || null)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
            }}
          />

          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              title={t('clear')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Quick presets for office staff */}
        {submissionDeadline && (
          <button
            type="button"
            onClick={() => setPreset(submissionDeadline)}
            title={`${t('match_deadline')} (${submissionDeadline})`}
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--color-primary-700)',
              background: 'var(--color-primary-50)',
              border: '1px solid var(--color-primary-200)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {t('match_deadline')}
          </button>
        )}
        <button
          type="button"
          onClick={() => setPreset(nextYearDate())}
          title={t('plus_one_year')}
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 8px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {t('plus_one_year')}
        </button>
      </div>
    </div>
  );
}
