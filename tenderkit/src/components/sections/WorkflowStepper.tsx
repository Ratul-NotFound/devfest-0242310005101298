'use client';

// src/components/sections/WorkflowStepper.tsx
// Professional horizontal step progress indicator for tender submission workflow

import { useApp } from '@/context/AppContext';
import { FileJson, Upload, Link2, Package, Check } from 'lucide-react';

export function WorkflowStepper() {
  const { state } = useApp();
  const isBn = state.language === 'bn';

  const hasRequirements = state.requirementsFile !== null;
  const hasFiles        = state.uploadedFiles.length > 0;
  const okCount         = state.requirementStates.filter(s => s.status === 'ok').length;
  const totalCount      = state.requirementStates.length;
  const isReady         = hasRequirements && totalCount > 0 && okCount === totalCount;

  const steps = [
    {
      stepNumber: 1,
      title: isBn ? 'প্রয়োজনীয়তা লোড' : 'Load Requirements',
      desc: hasRequirements
        ? `${state.requirementsFile?.tender.tender_id || 'Loaded'}`
        : isBn ? 'requirements.json ফাইল' : 'requirements.json',
      done: hasRequirements,
      active: !hasRequirements,
      icon: FileJson,
    },
    {
      stepNumber: 2,
      title: isBn ? 'ডকুমেন্ট আপলোড' : 'Upload Documents',
      desc: hasFiles
        ? (isBn ? `${state.uploadedFiles.length}টি ফাইল যুক্ত` : `${state.uploadedFiles.length} files attached`)
        : isBn ? 'পিডিএফ ফাইল আপলোড' : 'Tender PDF files',
      done: hasFiles,
      active: hasRequirements && !hasFiles,
      icon: Upload,
    },
    {
      stepNumber: 3,
      title: isBn ? 'মিলান ও যাচাই' : 'Match & Verify',
      desc: hasRequirements
        ? (isBn ? `${okCount}/${totalCount} যাচাইকৃত` : `${okCount}/${totalCount} verified`)
        : isBn ? 'বাধ্যতামূলক কাগজপত্র' : 'Document status',
      done: isReady,
      active: hasRequirements && hasFiles && !isReady,
      icon: Link2,
    },
    {
      stepNumber: 4,
      title: isBn ? 'প্যাকেজ তৈরি' : 'Generate Package',
      desc: isReady
        ? (isBn ? 'ডাউনলোডের জন্য প্রস্তুত' : 'Ready to download')
        : isBn ? 'সম্পূর্ণ প্যাকেজ PDF' : 'Combined submission PDF',
      done: isReady,
      active: isReady,
      icon: Package,
    },
  ];

  return (
    <div
      style={{
        background: 'var(--surface-0)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          position: 'relative',
          gap: '12px',
        }}
      >
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.stepNumber}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                position: 'relative',
                minWidth: 0,
              }}
            >
              {/* Step indicator node */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '12px',
                  fontWeight: 800,
                  transition: 'all var(--duration-base)',
                  background: s.done
                    ? 'var(--color-success-bg)'
                    : s.active
                    ? 'var(--color-primary-600)'
                    : 'var(--surface-2)',
                  color: s.done
                    ? 'var(--color-success-text)'
                    : s.active
                    ? '#ffffff'
                    : 'var(--text-muted)',
                  border: `2px solid ${
                    s.done
                      ? 'var(--color-success-border)'
                      : s.active
                      ? 'var(--color-primary-600)'
                      : 'var(--border-default)'
                  }`,
                  boxShadow: s.active ? '0 0 0 3px var(--color-primary-100)' : 'none',
                }}
              >
                {s.done ? <Check size={16} strokeWidth={2.5} /> : <Icon size={14} />}
              </div>

              {/* Step text content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: s.done
                        ? 'var(--color-success-text)'
                        : s.active
                        ? 'var(--color-primary-700)'
                        : 'var(--text-muted)',
                    }}
                  >
                    {isBn ? `ধাপ ${s.stepNumber}` : `Step ${s.stepNumber}`}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: s.active || s.done ? 'var(--text-primary)' : 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.3,
                  }}
                >
                  {s.title}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: s.done ? 'var(--color-success-text)' : 'var(--text-muted)',
                    fontWeight: s.done ? 600 : 400,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.2,
                  }}
                >
                  {s.desc}
                </div>
              </div>

              {/* Visual connecting line between steps */}
              {idx < steps.length - 1 && (
                <div
                  className="hidden-sm"
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '-6px',
                    width: '12px',
                    height: '2px',
                    background: s.done ? 'var(--color-success-border)' : 'var(--border-subtle)',
                    zIndex: 1,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
