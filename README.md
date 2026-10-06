<p align="center">
  <img src="./Brand_logo.png" alt="TenderKit Logo" width="180" />
</p>

# TenderKit — Tender Document Package Builder

> **AI DevFest Vibe Coding Contest Submission**

## Live Demo
🔗 [Live App — Vercel URL](https://tenderkit.vercel.app) *(will be updated after deployment)*

## What It Does
TenderKit helps government tender bidders build a correctly ordered, validated PDF package for submission. It:
- Loads a `requirements.json` tender specification
- Accepts multiple PDF uploads (max 30 files, 50 MB total)
- Matches each PDF to its required document slot
- Validates all status rules (missing, expiry, expired, not provided, OK)
- Detects duplicate files (same content hash)
- Generates a combined PDF with cover page, document index, and footer on every page
- Downloads as `<tender_id>_Package.pdf`

## Tech Stack
- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** for utility classes
- **pdf-lib** for PDF generation and cover/footer injection
- **pdfjs-dist** for page counting and file validation
- **Zod** for requirements.json validation
- **Framer Motion** for animations
- **Lucide React** for icons

## How to Run
```bash
cd tenderkit
npm install
npm run dev        # Start dev server at localhost:3000
npm run build      # Production build
npm run lint       # ESLint check
```

## Main Features Done
- [x] Load `requirements.json` with Zod validation
- [x] Drag-drop PDF upload (multi-file)
- [x] Non-PDF rejection with clear error messages
- [x] File removal
- [x] 1:1 file-to-requirement matching with undo
- [x] Expiry date input for `has_expiry=true` documents
- [x] All 5 status rules (missing, expiry_needed, expired, not_provided, ok)
- [x] Same-day expiry = OK rule
- [x] Duplicate file detection (SHA-256 hash)
- [x] Live status updates on every change
- [x] Generate button disabled with blocking issue list
- [x] Cover page with all required fields
- [x] Documents sorted by `order`, optional docs skipped
- [x] Footer on every page: `<tender_id> | Page X of Y`
- [x] Download as `<tender_id>_Package.pdf`
- [x] Full English/Bangla language toggle
- [x] Dark/light theme toggle

## Bonus Features
- [x] Index page after cover (document → page number)
- [x] Auto-match: filename similarity scoring
- [x] CSV export of checklist
- [x] Save project state to localStorage

## Known Issues / Limitations
- Bangla text on PDF cover page not supported (pdf-lib lacks Bangla font support without a custom font embed; English used for PDF cover)
- Very large PDFs (>10 MB single file) may take a few seconds to process

## AI Tools Used
- Antigravity (Google Deepmind AI IDE) for code generation

## Most Useful Prompt
> "Build a complete Next.js frontend-only web app for a Bangladesh government tender document package builder. Load requirements.json, upload PDFs, match files to requirements, validate 5 status rules (missing/expiry_needed/expired/not_provided/ok), detect duplicates via SHA-256 hash, generate a combined PDF with cover page and page footers using pdf-lib, support EN/BN language toggle and dark/light theme. All processing must be browser-only."

## Output Files
- `output/T-2026-0417_Package.pdf` — Sample pack output
- `screenshots/` — App screenshots

## Registration Number
*(As per contest registration)*
