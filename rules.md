# Non-Negotiable Rules — TenderKit

## Security
1. NEVER commit API keys, tokens, passwords, or personal data
2. NEVER upload document files to any backend or storage service (frontend-only)
3. NEVER use dangerouslySetInnerHTML with unsanitized data
4. NEVER use eval() or Function()
5. All user input must be validated with Zod on the client side

## Data Privacy
6. All document processing must happen entirely in the browser
7. No PDF content may leave the user's device
8. No analytics or tracking that sends document metadata off-device

## Code Quality
9. TypeScript strict mode — no `any` types
10. No console.log in production code
11. No dead code, unused imports, or commented-out blocks
12. Every component must handle loading, empty, and error states

## UI / Design
13. All colors from CSS variables only — no hard-coded hex/rgb in components
14. All UI text from i18n.ts — no hard-coded strings in components
15. Minimum 44px touch targets for all interactive elements
16. All animations must respect prefers-reduced-motion

## Git
17. Commit at least once every 30 minutes
18. Every commit message must include: what changed + AI prompt used
19. No force push, no rebase of pushed commits

## PDF Output
20. Cover page must include: tender ID, title, procuring entity, bidder, deadline, made date, included docs list
21. Footer on EVERY page (including cover): `<tender_id> | Page X of Y`
22. Documents sorted by `order` field from requirements.json
23. Optional docs with no file are SKIPPED from output

## Status Logic
24. Same-day expiry (expiry == submission_deadline) is OK, not expired
25. Duplicate files (same hash) must never be matched to different requirements
26. Generate button disabled when ANY document has a blocking status
