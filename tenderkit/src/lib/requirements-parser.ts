// src/lib/requirements-parser.ts
// Parse and validate requirements.json using Zod

import { z } from 'zod';
import { RequirementsFile } from '@/types';

const TenderSchema = z.object({
  tender_id: z.string().min(1),
  title: z.string().min(1),
  procuring_entity: z.string().min(1),
  bidder: z.string().min(1),
  submission_deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
});

const RequirementSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().positive(),
  title_en: z.string().min(1),
  title_bn: z.string().min(1),
  mandatory: z.boolean(),
  has_expiry: z.boolean(),
});

const RequirementsFileSchema = z.object({
  tender: TenderSchema,
  requirements: z.array(RequirementSchema).min(1),
});

export type ParseResult =
  | { success: true; data: RequirementsFile }
  | { success: false; error: 'invalid_json' | 'invalid_format'; details?: string };

/**
 * Parse and validate a requirements.json file.
 * Returns typed data or a typed error.
 */
export async function parseRequirementsFile(file: File): Promise<ParseResult> {
  let raw: unknown;
  try {
    const text = await file.text();
    raw = JSON.parse(text);
  } catch {
    return { success: false, error: 'invalid_json' };
  }

  const result = RequirementsFileSchema.safeParse(raw);
  if (!result.success) {
    return {
      success: false,
      error: 'invalid_format',
      details: result.error.issues.map(i => i.message).join(', '),
    };
  }

  return { success: true, data: result.data as RequirementsFile };
}
