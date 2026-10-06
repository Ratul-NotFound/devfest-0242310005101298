'use client';

// src/components/sections/HeroStrip.tsx
// Interactive pipeline status bar showing real-time submission packaging progress (No duplicate brand headers)

import { useApp, useT } from '@/context/AppContext';
import { FileJson, Upload, Link2, Package, CheckCircle2, CircleDot } from 'lucide-react';

export function HeroStrip() {
  const { state } = useApp();
  const t = useT();

  const hasRequirements = state.requirementsFile !== null;
  const hasFiles        = state.uploadedFiles.length > 0;
  const okCount         = state.requirementStates.filter(s => s.status === 'ok').length;
  const totalCount      = state.requirementStates.length;
  const isReady         = hasRequirements && totalCount > 0 && okCount === totalCount;

  const steps = [
    {
      num: '1',
      title: 'Load JSON',
      sub: hasRequirements ? `${state.requirementsFile?.tender.tender_id}` : 'Requirements file',
      done: hasRequirements,
      active: !hasRequirements,
      icon: FileJson,
    },
    {
      num: '2',
      title: 'Upload PDFs',
      sub: hasFiles ? `${state.uploadedFiles.length} files attached` : 'Drag & drop PDFs',
      done: hasFiles,
      active: hasRequirements && !hasFiles,
      icon: Upload,
    },
    {
      num: '3',
      title: 'Match & Validate',
      sub: hasRequirements ? `${okCount}/${totalCount} verified` : 'Real-time status',
      done: isReady,
      active: hasRequirements && hasFiles && !isReady,
      icon: Link2,
    },
    {
      num: '4',
      title: 'Generate Package',
      sub: isReady ? 'Ready to build PDF' : 'Correct PDF order',
      done: isReady,
      active: isReady,
      icon: Package,
    },
  ];

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-800) 60%, var(--color-primary-700) 100%)',
        borderBottom: '1px solid var(--color-primary-950)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background pattern */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          pointerEvents: 'none',
        }}
      />

      <div
        className="container-app"
        style={{ paddingTop: '14px', paddingBottom: '14px', position: 'relative' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* Left: Pipeline summary status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 'var(--radius-md)',
                background: isReady ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.12)',
                border: `1px solid ${isReady ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.2)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isReady ? '#34d399' : '#ffffff',
                flexShrink: 0,
              }}
            >
              {isReady ? <CheckCircle2 size={18} /> : <CircleDot size={18} />}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
                {isReady
                  ? 'All Documents Verified & Ready for Submission'
                  : hasRequirements
                  ? `${okCount} of ${totalCount} Requirements Ready`
                  : 'Tender Packaging Pipeline'}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.2, marginTop: '2px' }}>
                {isReady
                  ? 'Click Generate Package to produce your official PDF'
                  : hasRequirements
                  ? state.requirementsFile?.tender.title
                  : t('app_subtitle')}
              </div>
            </div>
          </div>

          {/* Right: 4-Step Pipeline Flow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              overflowX: 'auto',
              maxWidth: '100%',
              paddingBottom: '2px',
            }}
          >
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.title} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      background: step.done
                        ? 'rgba(16,185,129,0.18)'
                        : step.active
                        ? 'rgba(255,255,255,0.2)'
                        : 'rgba(255,255,255,0.07)',
                      border: `1px solid ${
                        step.done
                          ? 'rgba(16,185,129,0.4)'
                          : step.active
                          ? 'rgba(255,255,255,0.35)'
                          : 'rgba(255,255,255,0.1)'
                      }`,
                      borderRadius: 'var(--radius-md)',
                      backdropFilter: 'blur(4px)',
                      transition: 'all var(--duration-base)',
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 'var(--radius-full)',
                        background: step.done
                          ? '#10b981'
                          : step.active
                          ? '#ffffff'
                          : 'rgba(255,255,255,0.2)',
                        color: step.done
                          ? '#ffffff'
                          : step.active
                          ? 'var(--color-primary-900)'
                          : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {step.done ? '✓' : step.num}
                    </div>

                    <Icon
                      size={13}
                      color={step.done ? '#34d399' : 'rgba(255,255,255,0.85)'}
                      strokeWidth={2}
                    />

                    <div>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: step.done ? '#a7f3d0' : '#ffffff',
                          lineHeight: 1.2,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {step.title}
                      </div>
                      <div
                        style={{
                          fontSize: '9px',
                          color: 'rgba(255,255,255,0.65)',
                          lineHeight: 1.1,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {step.sub}
                      </div>
                    </div>
                  </div>

                  {idx < steps.length - 1 && (
                    <span
                      style={{
                        color: 'rgba(255,255,255,0.3)',
                        fontSize: '12px',
                        fontWeight: 300,
                        flexShrink: 0,
                      }}
                    >
                      &rarr;
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
