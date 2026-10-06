'use client';

// src/components/ui/Button.tsx
// Reusable typed button with all variants, states, and hover effects

import { ButtonHTMLAttributes, ReactNode, useState } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

const variantBase: Record<Variant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)',
    color: 'white',
    border: 'none',
    boxShadow: 'var(--shadow-primary)',
  },
  secondary: {
    background: 'var(--surface-0)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-default)',
    boxShadow: 'var(--shadow-xs)',
  },
  danger: {
    background: 'var(--color-error-text)',
    color: 'white',
    border: 'none',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: 'none',
  },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: '6px 14px', fontSize: '13px', minHeight: '34px', gap: '6px' },
  md: { padding: '9px 18px', fontSize: '14px', minHeight: '40px', gap: '7px' },
  lg: { padding: '12px 24px', fontSize: '15px', minHeight: '48px', gap: '8px' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const isDisabled = disabled || loading;

  const getHoverStyle = (): React.CSSProperties => {
    if (isDisabled || !hovered) return {};
    switch (variant) {
      case 'primary':   return { transform: 'translateY(-1px)', boxShadow: 'var(--shadow-primary-lg)' };
      case 'secondary': return { borderColor: 'var(--color-primary-400)', color: 'var(--color-primary-600)' };
      case 'ghost':     return { background: 'var(--surface-2)' };
      default:          return {};
    }
  };

  return (
    <button
      {...props}
      disabled={isDisabled}
      onMouseEnter={e => { setHovered(true); onMouseEnter?.(e); }}
      onMouseLeave={e => { setHovered(false); onMouseLeave?.(e); }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        borderRadius: 'var(--radius-md)',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.45 : 1,
        transition: 'all var(--duration-base) var(--ease-default)',
        outline: 'none',
        userSelect: 'none',
        lineHeight: 1.4,
        letterSpacing: '0.01em',
        ...variantBase[variant],
        ...sizeStyles[size],
        ...getHoverStyle(),
        ...style,
      }}
    >
      {loading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : icon}
      {children}
    </button>
  );
}
