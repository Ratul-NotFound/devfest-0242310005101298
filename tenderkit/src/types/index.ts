not// src/types/index.ts
// All shared TypeScript types for TenderKit

export interface TenderInfo {
  tender_id: string;
  title: string;
  procuring_entity: string;
  bidder: string;
  submission_deadline: string; // YYYY-MM-DD
}

export interface Requirement {
  id: string;
  order: number;
  title_en: string;
  title_bn: string;
  mandatory: boolean;
  has_expiry: boolean;
}

export interface RequirementsFile {
  tender: TenderInfo;
  requirements: Requirement[];
}

export interface UploadedFile {
  id: string;           // UUID
  file: File;
  name: string;
  sizeBytes: number;
  pageCount: number | null;  // null while loading
  hash: string | null;       // SHA-256 hex, null while loading
  isDuplicate: boolean;
  duplicateOfId?: string;    // ID of the original file
  loadError?: string;        // e.g., "encrypted" | "corrupted"
}

export type DocumentStatus =
  | 'missing'         // mandatory, no file matched — BLOCKS
  | 'expiry_needed'   // has_expiry, file matched, no date — BLOCKS
  | 'expired'         // expiry < submission_deadline — BLOCKS
  | 'not_provided'    // optional, no file — no block
  | 'ok';             // file matched, expiry valid — no block

export interface RequirementState {
  requirement: Requirement;
  matchedFileId: string | null;
  expiryDate: string | null;   // YYYY-MM-DD
  status: DocumentStatus;
}

export type Language = 'en' | 'bn';
export type Theme = 'light' | 'dark';

export interface AppState {
  requirementsFile: RequirementsFile | null;
  uploadedFiles: UploadedFile[];
  requirementStates: RequirementState[];
  language: Language;
  theme: Theme;
}
