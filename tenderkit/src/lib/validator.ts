// src/lib/validator.ts
// Status computation and blocking logic for TenderKit
// All status rules per Section 5 of problem statement

import { Requirement, RequirementState, DocumentStatus, UploadedFile } from '@/types';

/**
 * Computes status for a single requirement.
 * Time complexity: O(1) per requirement
 */
export function computeStatus(
  requirement: Requirement,
  matchedFileId: string | null,
  expiryDate: string | null,
  submissionDeadline: string,
  uploadedFiles: UploadedFile[]
): DocumentStatus {
  const hasFile = matchedFileId !== null;

  if (!hasFile) {
    return requirement.mandatory ? 'missing' : 'not_provided';
  }

  // File is matched — check if the file is an error (encrypted/corrupted)
  const file = uploadedFiles.find(f => f.id === matchedFileId);
  if (file?.loadError) {
    return requirement.mandatory ? 'missing' : 'not_provided';
  }

  if (requirement.has_expiry) {
    if (!expiryDate) {
      return 'expiry_needed';
    }
    // Same-day expiry is OK (>= submission_deadline)
    // Compare dates as strings YYYY-MM-DD — lexicographic comparison works for ISO dates
    if (expiryDate < submissionDeadline) {
      return 'expired';
    }
  }

  return 'ok';
}

/**
 * Returns true if a status blocks package generation.
 */
export function isBlocking(status: DocumentStatus): boolean {
  return status === 'missing' || status === 'expiry_needed' || status === 'expired';
}

/**
 * Computes all requirement states from current app state.
 * O(n) where n = number of requirements
 */
export function computeAllStatuses(
  requirements: Requirement[],
  matches: Map<string, string | null>,      // reqId → fileId | null
  expiryDates: Map<string, string | null>,  // reqId → date | null
  submissionDeadline: string,
  uploadedFiles: UploadedFile[]
): RequirementState[] {
  return requirements
    .sort((a, b) => a.order - b.order)  // O(n log n) sort by order
    .map(req => {
      const matchedFileId = matches.get(req.id) ?? null;
      const expiryDate = expiryDates.get(req.id) ?? null;
      const status = computeStatus(
        req,
        matchedFileId,
        expiryDate,
        submissionDeadline,
        uploadedFiles
      );
      return { requirement: req, matchedFileId, expiryDate, status };
    });
}

/**
 * Returns all blocking requirement states.
 */
export function getBlockingStates(states: RequirementState[]): RequirementState[] {
  return states.filter(s => isBlocking(s.status));
}
