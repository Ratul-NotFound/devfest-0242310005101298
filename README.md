<p align="center">
  <img src="./Brand_logo.png" alt="TenderKit Logo" width="220" />
</p>

<h1 align="center">TenderKit — Tender Document Package Builder</h1>

<p align="center">
  <strong>Client-Side Automated Tender Packaging & Validation Web App</strong><br />
  <em>AI DevFest Vibe Coding Contest Submission</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Framework-Next.js%2016%20(App%20Router)-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Language-TypeScript%20Strict-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS%20+%20Tokens-38bdf8?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PDF%20Engine-pdf--lib%20+%20pdf.js-red?style=flat-square" alt="PDF Lib" />
  <img src="https://img.shields.io/badge/i18n-English%20|%20%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE-teal?style=flat-square" alt="i18n" />
  <img src="https://img.shields.io/badge/Security-100%25%20Client--Side-emerald?style=flat-square" alt="Client-Side" />
</p>

---

## 📌 Problem Overview & Solution
Government and corporate tender submissions require strict packaging rules:
- Specific document ordering
- Validation of mandatory vs optional documents
- Expiry date verification against submission deadlines
- Duplicate file elimination
- Official cover page generation and standardized running page footers (`<tender_id> | Page X of Y`)

**TenderKit** solves this by providing a 100% client-side, zero-backend web application that processes files locally in the browser, validates all requirements in real time, and produces submission-ready PDF packages.

---

## 🚀 Live Demo & Deployment
- **Live HTTPS URL**: [https://tenderkit.vercel.app](https://tenderkit.vercel.app)
- **Repository**: [https://github.com/Ratul-NotFound/devfest-0242310005101298](https://github.com/Ratul-NotFound/devfest-0242310005101298)

---

## ✨ Features Checklist

### 1. Main Tasks (Section 4 Compliance)
- [x] **4.1 Load List**: JSON parsing with Zod validation, ordering checklist, metadata extraction (Tender ID, title, procuring entity, bidder, deadline).
- [x] **4.2 Multi-PDF Upload**: Drag-and-drop & file picker, non-PDF rejection, per-file page counting, individual file deletion.
- [x] **4.3 1:1 Matching**: Exact one-to-one assignment between uploaded documents and requirements, instant unmatch/reassign controls.
- [x] **4.4 Expiry Date Handling**: Dynamic date selector for `has_expiry: true` requirements.
- [x] **4.5 Real-Time Status Engine**: Live evaluation of all 5 document statuses:
  - `Missing` (Mandatory doc, unfulfilled — **Blocks package**)
  - `Expiry date needed` (File attached, date missing — **Blocks package**)
  - `Expired` (Expiry date before submission deadline — **Blocks package**)
  - `Not provided` (Optional doc unfulfilled — **Does not block**)
  - `OK` (Document verified and compliant — **Does not block**)
  - *Rule: Same-day expiry is treated as valid (OK).*
- [x] **4.6 Duplicate Detection**: Cryptographic SHA-256 byte hashing via Web Crypto API with $O(1)$ duplicate lookup map. Disallows assigning duplicate files to different requirements.
- [x] **4.7 Package Generator**: Real-time blocking issue feedback and disabled state enforcement until all requirements are met.
- [x] **4.8 Standardized Download**: One-click download as `<tender_id>_Package.pdf`.
- [x] **4.9 Bilingual Interface (i18n)**: Seamless English (EN) and Bangla (বাংলা) toggle across all UI strings and requirement titles (`title_en` / `title_bn`).

### 2. PDF Package Rules (Section 6 Compliance)
- [x] **6.1 Cover Page (Page 1)**: Formatted official cover page with Tender ID, title, procuring entity, bidder name, submission deadline, creation timestamp, and table of included documents.
- [x] **6.2 Ordered Merging**: Merges all pages of included PDFs in exact requirement sequence, skipping empty optional slots.
- [x] **6.3 Running Footers**: Bottom footer on every page (including cover): `<tender_id> | Page X of Y`.
- [x] **6.4 Content Preservation**: Formatted footer with divider line positioned to prevent obscuring document text.

### 3. Bonus Features (Section 7 Compliance)
- [x] **⚡ 1-Click Auto-Match**: Bag-of-words similarity scoring algorithm mapping filenames to requirement titles.
- [x] **📑 Table of Contents / Index Page**: Optional Index Page listing starting page numbers for each document in the generated PDF package.
- [x] **📊 CSV Checklist Export**: Downloadable structured submission audit log.
- [x] **💾 Project Persistence**: Full session save & restore via JSON state files and browser `localStorage`.
- [x] **🛡️ Robust Error Handling**: Gracefully flags password-protected and corrupted PDFs without crashing.
- [x] **⚡ Quick Demo Loader**: Instant 1-click sample pack loader for fast evaluation and testing.

---

## 🛠️ Architecture & Tech Stack

```
src/
├── app/                  # Next.js App Router (layout.tsx, page.tsx, globals.css)
├── components/
│   ├── sections/         # AppHeader, FileUploader, RequirementsList, RequirementsLoader, GeneratePanel
│   └── ui/               # Modular UI Primitives (Button, Card, Badge, Modal, Input)
├── context/
│   └── AppContext.tsx    # State management, reducer, theme & language persistence
├── lib/
│   ├── pdf-builder.ts    # PDF compilation engine (Cover page, merger, footers, index)
│   ├── pdf-reader.ts     # Metadata extraction, SHA-256 hashing, page count with pdf-lib fallback
│   ├── validator.ts      # Status rules & blocking logic computation
│   ├── requirements-parser.ts # Zod schema validation
│   ├── sample-loader.ts  # Demo data loader
│   └── i18n.ts           # EN / BN localization dictionary
└── styles/
    └── tokens.css        # Design tokens & CSS variables
```

### Algorithmic Complexity
- **Duplicate Detection**: $O(N)$ hash computation using SubtleCrypto, $O(1)$ duplicate checking via hash map.
- **Status Computation**: $O(R)$ where $R$ is requirement count (instant live validation).
- **Auto-Matching**: $O(F \times R)$ similarity matrix matching using tokenized overlap scoring.

---

## 💻 How to Run Locally

### Prerequisites
- Node.js 18+ (tested on Node.js 20 & 22)
- npm / yarn / pnpm

### Steps
```bash
# 1. Navigate to project folder
cd tenderkit

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Open browser at http://localhost:3000
```

### Verification Commands
```bash
npm run type-check   # TypeScript strict check (0 errors)
npm run lint         # ESLint audit (0 errors, 0 warnings)
npm run build        # Production Next.js build
```

---

## 📦 Generated Deliverables
- **Sample Pack Output**: [`output/T-2026-0417_Package.pdf`](./output/T-2026-0417_Package.pdf) (16-page complete package with cover page and running footers).
- **Sample Data**: [`sample-pack/`](./sample-pack/)
- **Brand Assets**: Custom brand logo configured across application headers and favicon.

---

## 🛡️ Security & Privacy
- **100% Client-Side Processing**: No PDF bytes, documents, or metadata are ever uploaded to any external server or third-party cloud storage.
- **Zero API Keys**: Operates entirely within the browser sandbox using Web Crypto API and WebAssembly.
