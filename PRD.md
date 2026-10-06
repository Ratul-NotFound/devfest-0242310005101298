# PRD — TenderKit

## Problem
Government tender bidders must manually assemble 10+ required PDF documents in a specific order, check for expiry dates, and avoid duplicates. Mistakes cause bid rejection.

## Users
Office staff (non-technical) at companies submitting government tenders in Bangladesh.

## MUST Features
1. Load requirements.json → show tender details + sorted document list
2. Upload multiple PDFs at once, show name + page count
3. Reject non-PDFs with clear message
4. Remove uploaded files
5. Match file to requirement (1:1), change/undo anytime
6. Enter expiry date for has_expiry=true documents
7. Real-time status for every requirement:
   - Missing (mandatory, no file) — BLOCKS
   - Expiry date needed (has_expiry, file matched, no date) — BLOCKS
   - Expired (expiry before submission_deadline) — BLOCKS
   - Not provided (optional, no file) — no block
   - OK (file matched, expiry valid) — no block
8. Same-day expiry = OK
9. Duplicate detection: same file content → mark duplicate, block different-doc match
10. Generate button disabled when any blocking status exists + explain why
11. Cover page (EN): tender ID, title, procuring entity, bidder, deadline, made date, included docs list
12. Documents after cover, sorted by order, all pages, skip optional with no file
13. Every page (incl. cover): footer `<tender_id> | Page X of Y`
14. Footer readable, not covering content
15. Download as `<tender_id>_Package.pdf`
16. Full EN/BN language toggle (all UI labels, doc names from title_en/title_bn)
17. Frontend only — zero backend, zero file upload to servers

## SHOULD Features
- Dark/light theme toggle
- Drag-and-drop file upload
- Preview of uploaded PDF (thumbnail)
- Progress indicator during PDF generation

## BONUS Features
- Index page after cover (doc name → page number)
- Seal/signature: upload PNG → place on chosen pages
- Export checklist as CSV
- Save/reopen work via localStorage
- Bangla text on PDF cover page
- Auto-match by filename similarity
- Handle damaged/password-protected PDFs gracefully
- AI help with user's own API key

## NON-GOALS
- Any backend or server-side processing
- User accounts or authentication
- Storing documents anywhere other than browser memory
- Multi-tender management

## Success Criteria
- All MUST features work correctly with the sample pack and an unseen pack
- A non-technical office worker can complete the task in either language without help
- PDF output exactly matches Section 6 rules
- Clean, passing lint/type-check/build
