# AGENTS.md — TenderKit Project Guide

## Project Summary
TenderKit is a frontend-only web app that helps office staff build a correctly ordered, validated PDF package for government tender submissions. It loads requirements.json, lets users upload and match PDFs, validates status (missing/expired/ok), and generates a combined PDF with cover page and footers.

## Stack
- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript (strict)
- **Styling**: Tailwind CSS + CSS variables (design tokens)
- **PDF Processing**: pdf-lib (combine + footers), pdf.js (page count + preview)
- **Animation**: Framer Motion (transform/opacity only)
- **Icons**: Lucide React
- **Validation**: Zod
- **Language**: i18n via context (EN/BN toggle)
- **Deploy**: Vercel (GitHub integration)

## Commands
```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

## Folder Map
```
src/
  app/              # Next.js App Router (page.tsx, layout.tsx)
  components/
    ui/             # Primitives: Button, Card, Badge, Modal, Input, Heading
    sections/       # TenderHeader, RequirementsList, FileUploader, StatusPanel
  lib/
    pdf-builder.ts  # PDF generation logic (cover + merge + footer)
    pdf-reader.ts   # Page counting, duplicate detection (SHA-256 hash)
    validator.ts    # Status rules, blocking logic (Zod schemas)
    i18n.ts         # Translation strings EN/BN
    config.ts       # Site metadata + typed config
  data/
    requirements-sample.json  # Copy of sample for testing
  types/
    index.ts        # All shared types
  styles/
    tokens.css      # Design tokens (CSS variables)
public/
  fonts/            # Self-hosted fonts if needed
sample-pack/        # Provided sample data (do not modify)
output/             # Generated PDF goes here
screenshots/        # Required screenshot
```

## Code Style Rules
- TypeScript strict mode — no `any`, explicit return types
- All colors from CSS variables — NEVER hard-code hex/rgb in components
- All copy strings from i18n.ts — NEVER hard-code UI text
- Components: one responsibility, typed props via interface
- No console.log in production code
- Handle loading / empty / error states in every async operation
- DSA: comment Big-O where non-obvious (e.g., hash map lookup O(1))

## Do / Don't
- ✅ Use pdf-lib for PDF generation and footer injection
- ✅ Use pdf.js (pdfjs-dist) for reading page count and hashing
- ✅ Compute SHA-256 hash of file bytes for duplicate detection
- ✅ All processing in browser — no fetch to any backend
- ✅ Read plan.md + tasks.md first; do one task at a time
- ✅ Run lint + type-check before saying done
- ❌ No backend routes that receive file uploads
- ❌ No hard-coded API keys
- ❌ No dangerouslySetInnerHTML with unsanitized data
- ❌ No purple/pink gradient text, glowing blobs, glassmorphism everywhere

## Workflow
1. Read plan.md and tasks.md
2. Pick the next unchecked task
3. Implement → lint → type-check → tick the task
4. Commit with message: `[what changed] — AI: [prompt used]`
5. Repeat
