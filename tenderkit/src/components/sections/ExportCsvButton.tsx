'use client';

// src/components/sections/ExportCsvButton.tsx
// BONUS: Export checklist as CSV with UTF-8 BOM for Excel/Sheets compatibility

import { useApp, useT } from '@/context/AppContext';
import { FileDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export function ExportCsvButton() {
  const { state } = useApp();
  const t = useT();
  const [downloaded, setDownloaded] = useState(false);

  const canExport = state.requirementsFile !== null && state.requirementStates.length > 0;

  const exportCsv = () => {
    if (!state.requirementsFile) return;

    const headers = [
      'Order',
      'Document (EN)',
      'Document (BN)',
      'Mandatory',
      'Has Expiry',
      'Matched File',
      'Pages',
      'Expiry Date',
      'Status',
    ];

    const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`;

    const rows = [...state.requirementStates]
      .sort((a, b) => a.requirement.order - b.requirement.order)
      .map(s => {
        const file = state.uploadedFiles.find(f => f.id === s.matchedFileId);
        return [
          s.requirement.order,
          escapeCsv(s.requirement.title_en || ''),
          escapeCsv(s.requirement.title_bn || ''),
          s.requirement.mandatory ? 'Yes' : 'No',
          s.requirement.has_expiry ? 'Yes' : 'No',
          file ? escapeCsv(file.name) : '""',
          file?.pageCount ?? '',
          s.expiryDate ?? '',
          s.status,
        ].join(',');
      });

    // \uFEFF is UTF-8 Byte Order Mark (BOM) ensuring Excel displays Bangla and Unicode text correctly
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${state.requirementsFile.tender.tender_id || 'Tender'}_checklist.csv`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Keep object URL alive long enough for browser download to start
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1500);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      disabled={!canExport}
      onClick={exportCsv}
      icon={downloaded ? <Check size={14} color="var(--color-success-text)" /> : <FileDown size={14} />}
      style={{ width: '100%', justifyContent: 'center' }}
    >
      {downloaded ? 'CSV Downloaded!' : t('export_csv')}
    </Button>
  );
}
