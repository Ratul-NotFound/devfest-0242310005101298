'use client';

// src/app/page.tsx
// Main TenderKit application page

import { AppHeader } from '@/components/sections/AppHeader';
import { RequirementsLoader } from '@/components/sections/RequirementsLoader';
import { FileUploader } from '@/components/sections/FileUploader';
import { RequirementsList } from '@/components/sections/RequirementsList';
import { GeneratePanel } from '@/components/sections/GeneratePanel';
import { AutoMatchButton } from '@/components/sections/AutoMatchButton';
import { ExportCsvButton } from '@/components/sections/ExportCsvButton';
import { SaveLoadProject } from '@/components/sections/SaveLoadProject';

export default function Home() {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--surface-1)' }}>
      <AppHeader />

      <main
        className="container-app"
        style={{ paddingTop: '24px', paddingBottom: '48px' }}
      >
        {/* Hero / intro */}
        <div style={{ marginBottom: '24px' }}>
          <h1
            style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 4px',
              letterSpacing: '-0.01em',
            }}
          >
            Tender Document Package Builder
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            Load your requirements, upload PDFs, verify status, and generate a complete package ready to submit.
          </p>
        </div>

        {/* Main layout: 3-column on desktop */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px',
          }}
          className="lg:grid-cols-[340px_1fr_320px]"
        >
          {/* Left column: Requirements loader + Generate panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <RequirementsLoader />
            <GeneratePanel />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <AutoMatchButton />
              <ExportCsvButton />
              <SaveLoadProject />
            </div>
          </div>

          {/* Center column: File uploader + Requirements list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FileUploader />
            <RequirementsList />
          </div>

          {/* Right column on desktop: Status summary (shown inline on mobile) */}
          {/* Already included in GeneratePanel above */}
        </div>
      </main>
    </div>
  );
}
