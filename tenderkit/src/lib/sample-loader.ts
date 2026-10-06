// src/lib/sample-loader.ts
// Helper to load sample files from public/sample-pack for easy 1-click demo and testing

export const SAMPLE_PDF_NAMES = [
  '01_financial_proposal.pdf',
  '02_technical_proposal.pdf',
  '03_tin_certificate.pdf',
  '04_vat_certificate.pdf',
  'bank_solvency.pdf',
  'experience_cert.pdf',
  'experience_cert (1).pdf',
  'scan_0042.pdf',
  'trade_license_2025.pdf',
  'trade_license_2026.pdf',
];

/**
 * Fetch sample PDFs from /sample-pack/documents/ and return standard File objects.
 */
export async function fetchSamplePdfs(): Promise<File[]> {
  const files: File[] = [];

  for (const filename of SAMPLE_PDF_NAMES) {
    try {
      const res = await fetch(`/sample-pack/documents/${encodeURIComponent(filename)}`);
      if (!res.ok) continue;
      const blob = await res.blob();
      const file = new File([blob], filename, { type: 'application/pdf' });
      files.push(file);
    } catch {
      // Ignore individual file errors
    }
  }

  return files;
}

/**
 * Fetch sample requirements.json
 */
export async function fetchSampleRequirements(): Promise<File | null> {
  try {
    const res = await fetch('/sample-pack/requirements.json');
    if (!res.ok) return null;
    const blob = await res.blob();
    return new File([blob], 'requirements.json', { type: 'application/json' });
  } catch {
    return null;
  }
}
