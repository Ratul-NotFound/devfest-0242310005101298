'use client';

// src/components/sections/ExportCsvButton.tsx
// BONUS: Export checklist as CSV

import { useApp, useT } from '@/context/AppContext';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ExportCsvButton() {
  const { state } = useApp();
  const t = useT();

  const canExport = state.requirementsFile !== null && state.requirementStates.length > 0;

  const exportCsv = () => {
    if (!state.requirementsFile) return;

    const headers = ['Order', 'Document (EN)', 'Document (BN)', 'Mandatory', 'Has Expiry', 'Matched File', 'Pages', 'Expiry Date', 'Status'];

    const rows = [...state.requirementStates]
      .sort((a, b) => a.requirement.order - b.requirement.order)
      .map(s => {
        const file = state.uploadedFiles.find(f => f.id === s.matchedFileId);
        return [
          s.requirement.order,
          `"${s.requirement.title_en}"`,
          `"${s.requirement.title_bn}"`,
          s.requirement.mandatory ? 'Yes' : 'No',
          s.requirement.has_expiry ? 'Yes' : 'No',
          file ? `"${file.name}"` : '',
          file?.pageCount ?? '',
          s.expiryDate ?? '',
          s.status,
        ].join(',');
      });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.requirementsFile.tender.tender_id}_checklist.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!canExport) return null;

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={exportCsv}
      icon={<FileDown size={14} />}
      style={{ width: '100%', justifyContent: 'center' }}
    >
      {t('export_csv')}
    </Button>
  );
}
