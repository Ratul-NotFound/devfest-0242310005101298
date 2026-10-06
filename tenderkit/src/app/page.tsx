'use client';

// src/app/page.tsx
// Main TenderKit application page — professional 3-panel layout

import { AppHeader } from '@/components/sections/AppHeader';
import { WorkflowStepper } from '@/components/sections/WorkflowStepper';
import { RequirementsLoader } from '@/components/sections/RequirementsLoader';
import { FileUploader } from '@/components/sections/FileUploader';
import { RequirementsList } from '@/components/sections/RequirementsList';
import { GeneratePanel } from '@/components/sections/GeneratePanel';
import { AutoMatchButton } from '@/components/sections/AutoMatchButton';
import { ExportCsvButton } from '@/components/sections/ExportCsvButton';
import { LocalCacheManager } from '@/components/sections/LocalCacheManager';

export default function Home() {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--surface-1)' }}>
      <AppHeader />

      <main
        className="container-app"
        style={{ paddingTop: '20px', paddingBottom: '64px' }}
      >
        {/* Visual Process Stepper */}
        <WorkflowStepper />

        {/* 3-column desktop layout */}
        <div className="main-grid">
          {/* ── Left Panel ── */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <RequirementsLoader />
            <GeneratePanel />

            {/* Utility actions */}
            <div
              style={{
                background: 'var(--surface-0)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  margin: '0 0 4px',
                }}
              >
                Local DB & Tools
              </p>
              <AutoMatchButton />
              <ExportCsvButton />
              <LocalCacheManager />
            </div>
          </aside>

          {/* ── Center Column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
            <FileUploader />
            <RequirementsList />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
          TenderKit &mdash; Government Tender Document Package Builder &bull; All processing done locally in your browser &bull; No data sent to servers
        </p>
      </footer>
    </div>
  );
}
