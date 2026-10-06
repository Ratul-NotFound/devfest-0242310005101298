'use client';

// src/components/sections/HeroStrip.tsx
// Compact hero banner with workflow steps and contextual info

import Image from 'next/image';
import { useApp, useT } from '@/context/AppContext';
import { FileJson, Upload, Link2, Package, ShieldCheck } from 'lucide-react';

const STEPS = [
  { icon: FileJson,    key: 'Load JSON',         sub: 'Requirements file'  },
  { icon: Upload,      key: 'Upload PDFs',        sub: 'Drag & drop'        },
  { icon: Link2,       key: 'Match & Validate',   sub: 'Real-time status'   },
  { icon: Package,     key: 'Generate Package',   sub: 'Correct PDF order'  },
];

export function HeroStrip() {
  const { state } = useApp();
  const t = useT();

  const okCount    = state.requirementStates.filter(s => s.status === 'ok').length;
  const totalCount = state.requirementStates.length;
  const hasProject = state.requirementsFile !== null;

  return (
    <div
      style={{
        background: `linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-700) 60%, var(--color-primary-600) 100%)`,
        borderBottom: '1px solid var(--color-primary-800)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background texture dots */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
        }}
      />

      <div
        className="container-app"
        style={{
          paddingTop: '20px',
          paddingBottom: '20px',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>

          {/* Left: Brand + Tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)',
                flexShrink: 0,
              }}
            >
              <Image
                src="/logo.png"
                alt="TenderKit"
                width={40}
                height={40}
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <div>
              <h1
                style={{
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: '0 0 2px',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.2,
                }}
              >
                {t('app_title')}
              </h1>
              <p
                style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.7)',
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                {hasProject ? (
                  <>
                    <ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                    {okCount}/{totalCount} requirements ready
                  </>
                ) : (
                  'Bangladesh government tender document packaging'
                )}
              </p>
            </div>
          </div>

          {/* Right: Workflow steps */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            className="hidden lg:flex"
          >
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.key} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 'var(--radius-md)',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    <Icon size={14} color="rgba(255,255,255,0.9)" strokeWidth={2} />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', lineHeight: 1.2 }}>
                        {step.key}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.2 }}>
                        {step.sub}
                      </div>
                    </div>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div style={{ width: '6px', height: '1px', background: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
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
