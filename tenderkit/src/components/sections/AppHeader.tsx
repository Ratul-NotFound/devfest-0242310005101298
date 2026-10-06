'use client';

// src/components/sections/AppHeader.tsx
// Top navigation bar with language and theme toggles

import { useApp, useT } from '@/context/AppContext';
import { Moon, Sun, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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
        zIndex: 50,
        height: 'var(--header-height)',
        background: 'var(--surface-0)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-xs)',
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
        {/* Logo + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FileText size={20} color="white" strokeWidth={2} />
          </div>
          <div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.2,
              }}
            >
              {t('app_title')}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                lineHeight: 1,
              }}
              className="hidden sm:block"
            >
              {t('app_subtitle')}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Language toggle */}
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleLanguage}
            aria-label={`Switch to ${state.language === 'en' ? 'Bangla' : 'English'}`}
            style={{
              fontWeight: 600,
              letterSpacing: '0.01em',
              minWidth: '64px',
            }}
          >
            {t('language_toggle')}
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={t('theme_toggle')}
            style={{ padding: '8px' }}
          >
            {state.theme === 'light' ? (
              <Moon size={18} strokeWidth={1.5} />
            ) : (
              <Sun size={18} strokeWidth={1.5} />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
