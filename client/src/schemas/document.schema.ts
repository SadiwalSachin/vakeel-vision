import { z } from "zod";
import { MAX_FILE_SIZE_BYTES } from "@/constants/app.constants";

/**
 * Zod schemas for document forms.
 * Mirror the FastAPI backend validation constraints exactly.
 */

export const uploadDocumentSchema = z.object({
  file: z
    .instanceof(File, { message: "Please select a PDF file" })
    .refine((f) => f.type === "application/pdf", "Only PDF files are accepted")
    .refine(
      (f) => f.size <= MAX_FILE_SIZE_BYTES,
      `File size must be 20 MB or less`
    ),
});

export const createTextDocumentSchema = z.object({
  filename: z
    .string()
    .min(1, "Document name is required")
    .max(255, "Name must be 255 characters or fewer"),
  text: z
    .string()
    .min(1, "Document text is required")
    .max(500_000, "Text must be 500,000 characters or fewer"),
});

export const updateDocumentSchema = z.object({
  filename: z
    .string()
    .min(1, "Document name is required")
    .max(255, "Name must be 255 characters or fewer")
    .optional(),
});

export const askDocumentSchema = z.object({
  question: z
    .string()
    .min(1, "Please enter a question")
    .max(5000, "Question must be 5,000 characters or fewer"),
  top_k: z.number().int().min(1).max(10).default(5),
});

// Inferred types
export type UploadDocumentFormValues = z.infer<typeof uploadDocumentSchema>;
export type CreateTextDocumentFormValues = z.infer<typeof createTextDocumentSchema>;
export type UpdateDocumentFormValues = z.infer<typeof updateDocumentSchema>;
export type AskDocumentFormValues = z.infer<typeof askDocumentSchema>;
