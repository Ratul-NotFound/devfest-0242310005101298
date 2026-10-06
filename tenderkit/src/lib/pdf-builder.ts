// src/lib/pdf-builder.ts
// Generate the final tender package PDF using pdf-lib
// Follows Section 6 of the problem statement exactly

import { PDFDocument, rgb, StandardFonts, PDFPage } from 'pdf-lib';
import { TenderInfo, RequirementState } from '@/types';

const FOOTER_HEIGHT = 28;      // px reserved at bottom for footer
const FOOTER_FONT_SIZE = 9;
const COVER_FONT_SIZE_TITLE = 20;
const COVER_FONT_SIZE_HEADING = 13;
const COVER_FONT_SIZE_BODY = 11;
const MARGIN = 50;

/**
 * Format a date string YYYY-MM-DD to DD/MM/YYYY for display.
 */
function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

/**
 * Add footer to a page: "<tender_id> | Page X of Y"
 * Positioned at the bottom, ensuring it doesn't cover content.
 */
function addFooter(
  page: PDFPage,
  tenderId: string,
  pageNum: number,
  totalPages: number,
  font: import('pdf-lib').PDFFont
): void {
  const { width } = page.getSize();
  const text = `${tenderId}  |  Page ${pageNum} of ${totalPages}`;
  const textWidth = font.widthOfTextAtSize(text, FOOTER_FONT_SIZE);

  // Draw separator line
  page.drawLine({
    start: { x: MARGIN, y: FOOTER_HEIGHT },
    end: { x: width - MARGIN, y: FOOTER_HEIGHT },
    thickness: 0.5,
    color: rgb(0.6, 0.6, 0.6),
  });

  // Draw footer text centered
  page.drawText(text, {
    x: (width - textWidth) / 2,
    y: (FOOTER_HEIGHT - FOOTER_FONT_SIZE) / 2 + 2,
    size: FOOTER_FONT_SIZE,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });
}

/**
 * Build cover page with all required information.
 * Per Section 6.1: tender ID, title, procuring entity, bidder, deadline, made date, included docs list.
 */
async function buildCoverPage(
  pdfDoc: PDFDocument,
  tender: TenderInfo,
  includedDocs: Array<{ order: number; title: string }>,
  madeOn: string
): Promise<void> {
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = height - MARGIN - 20;

  // Header bar
  page.drawRectangle({
    x: 0,
    y: height - 80,
    width,
    height: 80,
    color: rgb(0.05, 0.47, 0.44), // teal-700 equivalent
  });

  // App name in header
  page.drawText('TenderKit', {
    x: MARGIN,
    y: height - 50,
    size: 14,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  page.drawText('Tender Document Package', {
    x: MARGIN,
    y: height - 68,
    size: 10,
    font: fontRegular,
    color: rgb(0.8, 0.95, 0.93),
  });

  y = height - 120;

  // Tender title (large)
  const titleLines = wrapText(tender.title, fontBold, COVER_FONT_SIZE_TITLE, width - 2 * MARGIN);
  for (const line of titleLines) {
    page.drawText(line, { x: MARGIN, y, size: COVER_FONT_SIZE_TITLE, font: fontBold, color: rgb(0.05, 0.15, 0.3) });
    y -= COVER_FONT_SIZE_TITLE + 6;
  }

  y -= 10;

  // Divider
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: width - MARGIN, y },
    thickness: 1,
    color: rgb(0.05, 0.47, 0.44),
  });

  y -= 24;

  // Tender details in a table-like layout
  const details: Array<[string, string]> = [
    ['Tender ID', tender.tender_id],
    ['Procuring Entity', tender.procuring_entity],
    ['Bidder', tender.bidder],
    ['Submission Deadline', formatDate(tender.submission_deadline)],
    ['Package Generated On', madeOn],
  ];

  for (const [label, value] of details) {
    page.drawText(label + ':', {
      x: MARGIN,
      y,
      size: COVER_FONT_SIZE_HEADING,
      font: fontBold,
      color: rgb(0.3, 0.3, 0.3),
    });
    page.drawText(value, {
      x: MARGIN + 170,
      y,
      size: COVER_FONT_SIZE_HEADING,
      font: fontRegular,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= COVER_FONT_SIZE_HEADING + 10;
  }

  y -= 20;

  // Divider
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: width - MARGIN, y },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });

  y -= 20;

  // Included documents list heading
  page.drawText('Included Documents', {
    x: MARGIN,
    y,
    size: COVER_FONT_SIZE_HEADING,
    font: fontBold,
    color: rgb(0.05, 0.47, 0.44),
  });
  y -= COVER_FONT_SIZE_HEADING + 12;

  for (const doc of includedDocs) {
    const bullet = `${doc.order}.  ${doc.title}`;
    page.drawText(bullet, {
      x: MARGIN + 10,
      y,
      size: COVER_FONT_SIZE_BODY,
      font: fontRegular,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= COVER_FONT_SIZE_BODY + 8;
    if (y < FOOTER_HEIGHT + 30) break; // Safety: don't overflow into footer
  }
}

/**
 * Build an index page listing document name → page number.
 * BONUS feature per Section 7.
 */
async function buildIndexPage(
  pdfDoc: PDFDocument,
  entries: Array<{ title: string; startPage: number }>
): Promise<void> {
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = height - MARGIN;

  page.drawText('Document Index', {
    x: MARGIN,
    y,
    size: 16,
    font: fontBold,
    color: rgb(0.05, 0.47, 0.44),
  });
  y -= 30;

  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: width - MARGIN, y },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.7),
  });
  y -= 20;

  // Column headers
  page.drawText('Document', { x: MARGIN, y, size: 10, font: fontBold, color: rgb(0.4, 0.4, 0.4) });
  page.drawText('Page', { x: width - MARGIN - 40, y, size: 10, font: fontBold, color: rgb(0.4, 0.4, 0.4) });
  y -= 16;

  for (const entry of entries) {
    const titleLines = wrapText(entry.title, fontRegular, 11, width - 2 * MARGIN - 60);
    for (let i = 0; i < titleLines.length; i++) {
      page.drawText(titleLines[i], {
        x: MARGIN,
        y,
        size: 11,
        font: fontRegular,
        color: rgb(0.1, 0.1, 0.1),
      });
      if (i === 0) {
        page.drawText(String(entry.startPage), {
          x: width - MARGIN - 40,
          y,
          size: 11,
          font: fontRegular,
          color: rgb(0.1, 0.1, 0.1),
        });
      }
      y -= 16;
    }
    y -= 4;
    if (y < FOOTER_HEIGHT + 30) break;
  }
}

/**
 * Wrap text to fit within maxWidth. Returns array of lines.
 */
function wrapText(
  text: string,
  font: import('pdf-lib').PDFFont,
  fontSize: number,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export interface BuildPackageOptions {
  tender: TenderInfo;
  states: RequirementState[];
  uploadedFileMap: Map<string, File>;     // fileId → File
  includeIndex?: boolean;
}

/**
 * Build the final combined PDF package.
 * Per Section 6: cover page, optional index, documents in order, footer on every page.
 * Returns Uint8Array of the combined PDF.
 */
export async function buildPackage(options: BuildPackageOptions): Promise<Uint8Array> {
  const { tender, states, uploadedFileMap, includeIndex = true } = options;

  // Filter documents to include: matched + not an error file (skip optional with no file)
  const toInclude = states
    .filter(s => s.matchedFileId !== null && s.status === 'ok')
    .sort((a, b) => a.requirement.order - b.requirement.order);

  // Load all source PDFs into PDFDocument objects
  const sourcePdfs: Array<{ state: RequirementState; pdf: PDFDocument; pageCount: number }> = [];
  for (const state of toInclude) {
    const file = uploadedFileMap.get(state.matchedFileId!);
    if (!file) continue;
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    sourcePdfs.push({ state, pdf, pageCount: pdf.getPageCount() });
  }

  // Calculate page offsets for index: cover=1, index=2 (if enabled), then docs
  const startPage = includeIndex ? 3 : 2;
  let currentPage = startPage;
  const indexEntries: Array<{ title: string; startPage: number }> = [];
  for (const { state, pageCount } of sourcePdfs) {
    indexEntries.push({ title: state.requirement.title_en, startPage: currentPage });
    currentPage += pageCount;
  }

  // Total pages = all source pages + cover (1) + index if enabled (1)
  const outputPdf = await PDFDocument.create();

  // 1. Cover page
  const madeOn = formatDate(new Date().toISOString().split('T')[0]);
  const includedDocsList = toInclude.map(s => ({
    order: s.requirement.order,
    title: s.requirement.title_en,
  }));
  await buildCoverPage(outputPdf, tender, includedDocsList, madeOn);

  // 2. Index page (bonus)
  if (includeIndex) {
    await buildIndexPage(outputPdf, indexEntries);
  }

  // 3. Copy all source PDF pages in order
  for (const { pdf } of sourcePdfs) {
    const indices = pdf.getPageIndices();
    const pages = await outputPdf.copyPages(pdf, indices);
    for (const page of pages) {
      outputPdf.addPage(page);
    }
  }

  // 4. Add footer to every page (including cover and index)
  const footerFont = await outputPdf.embedFont(StandardFonts.Helvetica);
  const allPages = outputPdf.getPages();
  for (let i = 0; i < allPages.length; i++) {
    addFooter(allPages[i], tender.tender_id, i + 1, allPages.length, footerFont);
  }

  return outputPdf.save();
}

/**
 * Trigger browser download of a Uint8Array as a file.
 */
export function downloadPdf(bytes: Uint8Array, filename: string): void {
  // Convert to ArrayBuffer explicitly to satisfy strict Blob typing
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
