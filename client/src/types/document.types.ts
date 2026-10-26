/**
 * Document-related TypeScript types.
 * Derived from FastAPI schemas in server/app/schemas/document.py
 */

/** Document source type — matches backend Literal["pdf", "text"] */
export type DocumentSourceType = "pdf" | "text";

/** Document processing status values observed from the backend */
export type DocumentStatus = "pending" | "uploaded" | "processed" | "analyzed" | "failed";

/** Matches DocumentRead schema */
export interface Document {
  id: number;
  filename: string | null;
  source_type: DocumentSourceType;
  content_type: string | null;
  file_size_bytes: number | null;
  status: DocumentStatus;
  summary: string | null;
  created_at: string | null; // ISO datetime string
  updated_at: string | null; // ISO datetime string
}

/** Matches DocumentCreate schema */
export interface DocumentCreate {
  filename?: string | null;
  source_type?: DocumentSourceType;
}

/** Matches DocumentUpdate schema */
export interface DocumentUpdate {
  filename?: string | null;
}

/** Matches DocumentTextCreate schema */
export interface DocumentTextCreate {
  filename: string;
  text: string;
}

/** Matches AskDocumentRequest schema */
export interface AskDocumentRequest {
  question: string;
  top_k?: number; // 1–10, default 5
}

/** Source reference returned by /ask and /embeddings endpoints */
export interface DocumentSource {
  label: string;
  chunk_id: number;
  chunk_index: number;
  page_number: number | null;
  distance: number;
  text: string;
}

/** Response shape from POST /documents/{id}/ask */
export interface AskDocumentResponse {
  document_id: number;
  question: string;
  answer: string;
  sources: DocumentSource[];
}

/** Response shape from POST /documents/{id}/embeddings */
export interface EmbeddingsResponse {
  document_id: number;
  question: string;
  sources: DocumentSource[];
}

/** Matches DocumentContentRead schema (server/app/schemas/documet_content.py) */
export interface DocumentContent {
  id: number;
  document_id: number;
  extracted_text: string;
  page_count: number | null;
}
