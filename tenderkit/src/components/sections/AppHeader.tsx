'use client';

// src/components/sections/AppHeader.tsx
// Top navigation bar with brand logo, language and theme toggles

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
        boxShadow: '0 1px 0 var(--border-subtle), var(--shadow-sm)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
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
        {/* Brand: Logo + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: 44,
              height: 44,
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
              width={44}
              height={44}
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <div>
            <div
              style={{
                fontSize: '17px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              TenderKit
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                lineHeight: 1.2,
                fontWeight: 400,
                letterSpacing: '0.01em',
              }}
              className="hidden sm:block"
            >
              {t('app_subtitle')}
            </div>
          </div>

          {/* Pill badge */}
          <span
            className="hidden md:inline-flex"
            style={{
              padding: '3px 10px',
              background: 'var(--color-primary-50)',
              border: '1px solid var(--color-primary-200)',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--color-primary-700)',
              letterSpacing: '0.02em',
            }}
          >
            BD Tender Docs
          </span>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            aria-label={`Switch to ${state.language === 'en' ? 'Bangla' : 'English'}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              letterSpacing: '0.01em',
              transition: 'all var(--duration-base) var(--ease-default)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget;
              el.style.background = 'var(--color-primary-600)';
              el.style.color = 'white';
              el.style.borderColor = 'var(--color-primary-600)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              el.style.background = 'var(--surface-2)';
              el.style.color = 'var(--text-primary)';
              el.style.borderColor = 'var(--border-default)';
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
              width: '38px',
              height: '38px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'all var(--duration-base) var(--ease-default)',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              const el = e.currentTarget;
              el.style.background = 'var(--color-primary-600)';
              el.style.color = 'white';
              el.style.borderColor = 'var(--color-primary-600)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              el.style.background = 'var(--surface-2)';
              el.style.color = 'var(--text-secondary)';
              el.style.borderColor = 'var(--border-default)';
            }}
          >
            {state.theme === 'light' ? (
              <Moon size={16} strokeWidth={2} />
            ) : (
              <Sun size={16} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
