# Plan — TenderKit

## Phase 0: Scaffold + Docs (Done When: repo has Next.js running, all docs committed)
- [x] Read problem statement + rulebook
- [x] Write AGENTS.md, PRD.md, design.md, plan.md, tasks.md
- [ ] Next.js scaffold created in tenderkit/
- [ ] Install dependencies: pdf-lib, pdfjs-dist, framer-motion, lucide-react, zod
- [ ] Design tokens CSS file
- [ ] First commit + push

## Phase 1: Core Data + Types (Done When: types defined, i18n working, JSON loader works)
- [ ] Define all TypeScript types
- [ ] i18n strings (EN + BN) in lib/i18n.ts
- [ ] LanguageContext provider
- [ ] ThemeContext provider (light/dark)
- [ ] JSON loader: parse requirements.json, validate with Zod, display tender header

## Phase 2: File Upload + Processing (Done When: PDFs upload, page count shows, duplicates detected)
- [ ] FileUploader component with drag-drop + click
- [ ] Non-PDF rejection with message
- [ ] File removal
- [ ] Read page count via pdf.js
- [ ] SHA-256 hash via SubtleCrypto for duplicate detection (O(n) hash, O(1) lookup via Map)
- [ ] Display uploaded files list with name, pages, duplicate badge

## Phase 3: Match + Validate (Done When: matching works, all 5 statuses correct)
- [ ] RequirementsList with match controls (dropdown/drag)
- [ ] 1:1 assignment enforcement
- [ ] Expiry date input for has_expiry documents
- [ ] Validator: compute status for each requirement (same-day = OK rule)
- [ ] Live status badges updating on every change
- [ ] Blocking summary (why Generate is disabled)

## Phase 4: PDF Generation (Done When: output PDF matches Section 6 exactly)
- [ ] Cover page generation with pdf-lib
- [ ] Merge all matched PDFs in order
- [ ] Footer on every page: `<tender_id> | Page X of Y`
- [ ] Skip optional docs with no file
- [ ] Download as `<tender_id>_Package.pdf`
- [ ] Generate button disabled logic + reasons shown

## Phase 5: First Deploy (Done When: live Vercel URL works end-to-end)
- [ ] Push to GitHub
- [ ] Connect Vercel
- [ ] Verify live deployment works

## Phase 6: Polish + SHOULD (Done When: responsive, dark mode, animations smooth)
- [ ] Dark/light toggle
- [ ] Responsive layout (mobile/tablet/desktop)
- [ ] Empty states, error states, loading states
- [ ] Framer Motion reveal animations
- [ ] Accessibility pass

## Phase 7: BONUS (Done When: at least 3 bonus features working)
- [ ] Auto-match by filename similarity
- [ ] Index page in PDF
- [ ] CSV export
- [ ] Save/restore via localStorage
- [ ] Handle damaged/password-protected PDFs

## Phase 8: Final Audit + Submit (Done When: checklist 100%, PDF in output/, screenshot in screenshots/)
- [ ] Requirements checklist audit
- [ ] Generate sample pack output PDF, put in output/T-2026-0417_Package.pdf
- [ ] Screenshot showing document statuses → screenshots/
- [ ] Security self-review
- [ ] Update README with live link
- [ ] Final push
