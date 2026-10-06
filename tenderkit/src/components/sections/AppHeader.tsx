'use client';

// src/components/sections/AppHeader.tsx
// Clean, professional top navigation bar with brand logo, title, and language/theme controls

import Image from 'next/image';
import { useApp, useT } from '@/context/AppContext';
import { Moon, Sun, Globe } from 'lucide-react';

export function AppHeader() {
  const { state, setLanguage, setTheme } = useApp();
  const t = useT();

  const toggleTheme = () => {
    setTheme(state.theme === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(state.language === 'en' ? 'bn' : 'en');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: 'var(--header-height)',
        background: 'var(--surface-0)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div
        className="container-app"
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Left: Brand Logo + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              src="/logo.png"
              alt="TenderKit Logo"
              width={38}
              height={38}
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '17px',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                TenderKit
              </span>
              <span
                className="hidden-sm"
                style={{
                  padding: '2px 8px',
                  background: 'var(--color-primary-50)',
                  border: '1px solid var(--color-primary-200)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: 'var(--color-primary-700)',
                  letterSpacing: '0.02em',
                }}
              >
                BD Tender
              </span>
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                lineHeight: 1.2,
                fontWeight: 400,
              }}
              className="hidden-sm"
            >
              {t('app_subtitle')}
            </div>
          </div>
        </div>

        {/* Right: Controls (Language & Theme) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            aria-label={`Switch to ${state.language === 'en' ? 'Bangla' : 'English'}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: 'var(--surface-1)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              letterSpacing: '0.01em',
              transition: 'all var(--duration-base) var(--ease-default)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget;
              el.style.background = 'var(--color-primary-50)';
              el.style.borderColor = 'var(--color-primary-300)';
              el.style.color = 'var(--color-primary-700)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              el.style.background = 'var(--surface-1)';
              el.style.borderColor = 'var(--border-default)';
              el.style.color = 'var(--text-primary)';
            }}
          >
            <Globe size={13} strokeWidth={2} />
            {t('language_toggle')}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={t('theme_toggle')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              background: 'var(--surface-1)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'all var(--duration-base) var(--ease-default)',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              const el = e.currentTarget;
              el.style.background = 'var(--color-primary-50)';
              el.style.borderColor = 'var(--color-primary-300)';
              el.style.color = 'var(--color-primary-700)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              el.style.background = 'var(--surface-1)';
              el.style.borderColor = 'var(--border-default)';
              el.style.color = 'var(--text-secondary)';
            }}
          >
            {state.theme === 'light' ? (
              <Moon size={15} strokeWidth={2} />
            ) : (
              <Sun size={15} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
