# Tasks — TenderKit
## Priority order: top = most urgent. Tick when done.

### Phase 0: Scaffold
- [ ] T01: Verify Next.js scaffold is working (npm run dev)
- [ ] T02: Install pdf-lib, pdfjs-dist, framer-motion, lucide-react, zod
- [ ] T03: Create src/styles/tokens.css with all CSS design tokens
- [ ] T04: Update tailwind.config with custom colors from tokens
- [ ] T05: Set up Google Fonts (Inter + Hind Siliguri) in layout.tsx
- [ ] T06: Create .gitignore and .env.example
- [ ] T07: First commit + push

### Phase 1: Data + Contexts
- [ ] T08: Create src/types/index.ts with all shared types
- [ ] T09: Create src/lib/i18n.ts with EN/BN strings for all UI text
- [ ] T10: Create LanguageContext (provider + hook)
- [ ] T11: Create ThemeContext (provider + hook, persisted to localStorage)
- [ ] T12: Create src/lib/config.ts with site metadata
- [ ] T13: JSON loader: FileInput for requirements.json, parse + validate with Zod
- [ ] T14: TenderHeader component showing tender details

### Phase 2: File Upload
- [ ] T15: FileUploader component (drag-drop + click to upload)
- [ ] T16: Non-PDF rejection with i18n error message
- [ ] T17: File size limit check (50MB total)
- [ ] T18: Read page count per file using pdfjs-dist
- [ ] T19: SHA-256 hash via SubtleCrypto for each file
- [ ] T20: Duplicate detection using hash Map (O(1) lookup)
- [ ] T21: UploadedFilesList: show name, pages, size, duplicate badge
- [ ] T22: Remove file button with confirmation

### Phase 3: Requirements + Matching
- [ ] T23: RequirementsList component showing all docs sorted by order
- [ ] T24: Match control: assign uploaded file to requirement (select dropdown)
- [ ] T25: 1:1 enforcement: file can only match one req, req can only have one file
- [ ] T26: Unmatch/change match action
- [ ] T27: ExpiryDateInput for has_expiry=true requirements
- [ ] T28: Validator: compute status for each requirement (all 5 statuses)
- [ ] T29: Same-day expiry = OK rule
- [ ] T30: Live status badges on each requirement row
- [ ] T31: Duplicate file badge on uploaded files list

### Phase 4: PDF Generation
- [ ] T32: GenerateButton: disabled when any blocking status, show reasons
- [ ] T33: CoverPage builder using pdf-lib (all required fields)
- [ ] T34: Merge matched PDFs in order using pdf-lib
- [ ] T35: Skip optional docs with no file
- [ ] T36: Add footer to every page: `<tender_id> | Page X of Y`
- [ ] T37: Footer positioning: bottom of page, not covering content
- [ ] T38: Download trigger: `<tender_id>_Package.pdf`

### Phase 5: UI Polish
- [ ] T39: Dark/light theme toggle in header
- [ ] T40: EN/BN language toggle in header
- [ ] T41: Responsive layout (mobile stacked, desktop 3-col)
- [ ] T42: Empty states for no JSON loaded, no files uploaded
- [ ] T43: Error states (file read error, PDF corrupted)
- [ ] T44: Loading spinner during PDF generation
- [ ] T45: Framer Motion scroll-reveal on list items
- [ ] T46: Hover transitions on buttons and cards

### Phase 6: BONUS
- [ ] T47: Auto-match: score filename vs document title, suggest matches
- [ ] T48: Index page in PDF (doc → page number)
- [ ] T49: CSV export of checklist
- [ ] T50: Save/restore project state via localStorage

### Phase 7: Finalize
- [ ] T51: Run lint + type-check, fix all errors
- [ ] T52: Security self-review
- [ ] T53: Generate output PDF from sample pack → save to output/
- [ ] T54: Take screenshot showing document statuses → save to screenshots/
- [ ] T55: Update README.md with live Vercel URL and full details
- [ ] T56: Final commit + push
