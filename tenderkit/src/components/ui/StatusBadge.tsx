'use client';

// src/components/ui/StatusBadge.tsx
// Visual badge showing document status

import { DocumentStatus } from '@/types';
import { CheckCircle2, AlertCircle, Clock, XCircle, MinusCircle } from 'lucide-react';
import { useT } from '@/context/AppContext';

interface StatusBadgeProps {
  status: DocumentStatus;
  size?: 'sm' | 'md';
}

const statusConfig = {
  ok: {
    icon: CheckCircle2,
    cssVar: '--color-success',
    bg: 'var(--color-success-bg)',
    text: 'var(--color-success-text)',
    border: 'var(--color-success-border)',
    key: 'status_ok' as const,
  },
  missing: {
    icon: XCircle,
    cssVar: '--color-error',
    bg: 'var(--color-error-bg)',
    text: 'var(--color-error-text)',
    border: 'var(--color-error-border)',
    key: 'status_missing' as const,
  },
  expiry_needed: {
    icon: Clock,
    cssVar: '--color-warning',
    bg: 'var(--color-warning-bg)',
    text: 'var(--color-warning-text)',
    border: 'var(--color-warning-border)',
    key: 'status_expiry_needed' as const,
  },
  expired: {
    icon: AlertCircle,
    cssVar: '--color-error',
    bg: 'var(--color-error-bg)',
    text: 'var(--color-error-text)',
    border: 'var(--color-error-border)',
    key: 'status_expired' as const,
  },
  not_provided: {
    icon: MinusCircle,
    cssVar: '--color-neutral',
    bg: 'var(--color-neutral-bg)',
    text: 'var(--color-neutral-text)',
    border: 'var(--color-neutral-border)',
    key: 'status_not_provided' as const,
  },
} satisfies Record<DocumentStatus, { icon: React.ElementType; cssVar: string; bg: string; text: string; border: string; key: string }>;

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const t = useT();
  const config = statusConfig[status];
  const Icon = config.icon;
  const iconSize = size === 'sm' ? 12 : 14;
  const padding = size === 'sm' ? '2px 6px' : '3px 8px';
  const fontSize = size === 'sm' ? '11px' : '12px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding,
        fontSize,
        fontWeight: 500,
        borderRadius: 'var(--radius-full)',
        background: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon size={iconSize} strokeWidth={2} />
      {t(config.key as Parameters<typeof t>[0])}
    </span>
  );
}
