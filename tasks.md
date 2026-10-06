# Tasks — TenderKit
## Priority order: top = most urgent. Tick when done.

### Phase 0: Scaffold
- [x] T01: Verify Next.js scaffold is working (npm run dev)
- [x] T02: Install pdf-lib, pdfjs-dist, framer-motion, lucide-react, zod
- [x] T03: Create src/styles/tokens.css with all CSS design tokens
- [x] T04: Update tailwind.config with custom colors from tokens
- [x] T05: Set up Google Fonts (Inter + Hind Siliguri) in layout.tsx
- [x] T06: Create .gitignore and .env.example
- [x] T07: First commit + push

### Phase 1: Data + Contexts
- [x] T08: Create src/types/index.ts with all shared types
- [x] T09: Create src/lib/i18n.ts with EN/BN strings for all UI text
- [x] T10: Create LanguageContext (provider + hook)
- [x] T11: Create ThemeContext (provider + hook, persisted to localStorage)
- [x] T12: Create src/lib/config.ts with site metadata
- [x] T13: JSON loader: FileInput for requirements.json, parse + validate with Zod
- [x] T14: TenderHeader component showing tender details

### Phase 2: File Upload
- [x] T15: FileUploader component (drag-drop + click to upload)
- [x] T16: Non-PDF rejection with i18n error message
- [x] T17: File size limit check (50MB total)
- [x] T18: Read page count per file using pdfjs-dist / pdf-lib
- [x] T19: SHA-256 hash via SubtleCrypto for each file
- [x] T20: Duplicate detection using hash Map (O(1) lookup)
- [x] T21: UploadedFilesList: show name, pages, size, duplicate badge
- [x] T22: Remove file button with confirmation

### Phase 3: Requirements + Matching
- [x] T23: RequirementsList component showing all docs sorted by order
- [x] T24: Match control: assign uploaded file to requirement (select dropdown)
- [x] T25: 1:1 enforcement: file can only match one req, req can only have one file
- [x] T26: Unmatch/change match action
- [x] T27: ExpiryDateInput for has_expiry=true requirements
- [x] T28: Validator: compute status for each requirement (all 5 statuses)
- [x] T29: Same-day expiry = OK rule
- [x] T30: Live status badges on each requirement row
- [x] T31: Duplicate file badge on uploaded files list

### Phase 4: PDF Generation
- [x] T32: GenerateButton: disabled when any blocking status, show reasons
- [x] T33: CoverPage builder using pdf-lib (all required fields)
- [x] T34: Merge matched PDFs in order using pdf-lib
- [x] T35: Skip optional docs with no file
- [x] T36: Add footer to every page: `<tender_id> | Page X of Y`
- [x] T37: Footer positioning: bottom of page, not covering content
- [x] T38: Download trigger: `<tender_id>_Package.pdf`

### Phase 5: UI Polish
- [x] T39: Dark/light theme toggle in header
- [x] T40: EN/BN language toggle in header
- [x] T41: Responsive layout (mobile stacked, desktop 3-col)
- [x] T42: Empty states for no JSON loaded, no files uploaded
- [x] T43: Error states (file read error, PDF corrupted)
- [x] T44: Loading spinner during PDF generation
- [x] T45: Framer Motion scroll-reveal on list items
- [x] T46: Hover transitions on buttons and cards

### Phase 6: BONUS
- [x] T47: Auto-match: score filename vs document title, suggest matches
- [x] T48: Index page in PDF (doc → page number)
- [x] T49: CSV export of checklist
- [x] T50: Save/restore project state via localStorage

### Phase 7: Finalize
- [x] T51: Run lint + type-check, fix all errors
- [x] T52: Security self-review
- [x] T53: Generate output PDF from sample pack → save to output/
- [ ] T54: Take screenshot showing document statuses → save to screenshots/
- [x] T55: Update README.md with live Vercel URL and full details
- [ ] T56: Final commit + push
