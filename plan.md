# Plan — TenderKit

## Phase 0: Scaffold + Docs (Done When: repo has Next.js running, all docs committed)
- [x] Read problem statement + rulebook
- [x] Write AGENTS.md, PRD.md, design.md, plan.md, tasks.md
- [x] Next.js scaffold created in tenderkit/
- [x] Install dependencies: pdf-lib, pdfjs-dist, framer-motion, lucide-react, zod
- [x] Design tokens CSS file
- [x] First commit + push

## Phase 1: Core Data + Types (Done When: types defined, i18n working, JSON loader works)
- [x] Define all TypeScript types
- [x] i18n strings (EN + BN) in lib/i18n.ts
- [x] LanguageContext provider
- [x] ThemeContext provider (light/dark)
- [x] JSON loader: parse requirements.json, validate with Zod, display tender header

## Phase 2: File Upload + Processing (Done When: PDFs upload, page count shows, duplicates detected)
- [x] FileUploader component with drag-drop + click
- [x] Non-PDF rejection with message
- [x] File removal
- [x] Read page count via pdf.js / pdf-lib
- [x] SHA-256 hash via SubtleCrypto for duplicate detection (O(n) hash, O(1) lookup via Map)
- [x] Display uploaded files list with name, pages, duplicate badge

## Phase 3: Match + Validate (Done When: matching works, all 5 statuses correct)
- [x] RequirementsList with match controls (dropdown/drag)
- [x] 1:1 assignment enforcement
- [x] Expiry date input for has_expiry documents
- [x] Validator: compute status for each requirement (same-day = OK rule)
- [x] Live status badges updating on every change
- [x] Blocking summary (why Generate is disabled)

## Phase 4: PDF Generation (Done When: output PDF matches Section 6 exactly)
- [x] Cover page generation with pdf-lib
- [x] Merge all matched PDFs in order
- [x] Footer on every page: `<tender_id> | Page X of Y`
- [x] Skip optional docs with no file
- [x] Download as `<tender_id>_Package.pdf`
- [x] Generate button disabled logic + reasons shown

## Phase 5: First Deploy (Done When: live Vercel URL works end-to-end)
- [x] Push to GitHub
- [x] Connect Vercel
- [x] Verify live deployment works

## Phase 6: Polish + SHOULD (Done When: responsive, dark mode, animations smooth)
- [x] Dark/light toggle
- [x] Responsive layout (mobile/tablet/desktop)
- [x] Empty states, error states, loading states
- [x] Framer Motion reveal animations
- [x] Accessibility pass

## Phase 7: BONUS (Done When: at least 3 bonus features working)
- [x] Auto-match by filename similarity
- [x] Index page in PDF
- [x] CSV export
- [x] Save/restore via localStorage
- [x] Handle damaged/password-protected PDFs

## Phase 8: Final Audit + Submit (Done When: checklist 100%, PDF in output/, screenshot in screenshots/)
- [x] Requirements checklist audit
- [x] Generate sample pack output PDF, put in output/T-2026-0417_Package.pdf
- [ ] Screenshot showing document statuses → screenshots/
- [x] Security self-review
- [x] Update README with live link
- [ ] Final push
