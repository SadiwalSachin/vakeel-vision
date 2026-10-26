/**
 * Document service — all document API calls go through this file.
 * Rule: Pages must never call apiClient directly.
 * Rule: Every backend endpoint path must come from api-routes.ts.
 */

import { apiClient } from "@/lib/axios";
import { API_ROUTES } from "@/lib/api-routes";
import type {
  Document,
  DocumentCreate,
  DocumentUpdate,
  DocumentTextCreate,
  AskDocumentRequest,
  AskDocumentResponse,
  EmbeddingsResponse,
  DocumentContent,
} from "@/types/document.types";

export const documentService = {
  /** GET /documents/ */
  list: async (): Promise<Document[]> => {
    const { data } = await apiClient.get<Document[]>(API_ROUTES.documents.list);
    return data;
  },

  /** POST /documents/ */
  create: async (payload: DocumentCreate): Promise<Document> => {
    const { data } = await apiClient.post<Document>(
      API_ROUTES.documents.create,
      payload
    );
    return data;
  },

  /** GET /documents/{id} */
  getById: async (id: number | string): Promise<Document> => {
    const { data } = await apiClient.get<Document>(
      API_ROUTES.documents.getById(id)
    );
    return data;
  },

  /** PATCH /documents/{id} */
  update: async (
    id: number | string,
    payload: DocumentUpdate
  ): Promise<Document> => {
    const { data } = await apiClient.patch<Document>(
      API_ROUTES.documents.update(id),
      payload
    );
    return data;
  },

  /** DELETE /documents/{id} */
  delete: async (id: number | string): Promise<void> => {
    await apiClient.delete(API_ROUTES.documents.delete(id));
  },

  /** POST /documents/upload — multipart/form-data */
  upload: async (file: File): Promise<Document> => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await apiClient.post<Document>(
      API_ROUTES.documents.upload,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },

  /** POST /documents/text */
  createFromText: async (payload: DocumentTextCreate): Promise<Document> => {
    const { data } = await apiClient.post<Document>(
      API_ROUTES.documents.createFromText,
      payload
    );
    return data;
  },

  /** GET /documents/{id}/content */
  getContent: async (id: number | string): Promise<DocumentContent> => {
    const { data } = await apiClient.get<DocumentContent>(
      API_ROUTES.documents.content(id)
    );
    return data;
  },

  /** POST /documents/{id}/ask */
  ask: async (
    id: number | string,
    payload: AskDocumentRequest
  ): Promise<AskDocumentResponse> => {
    const { data } = await apiClient.post<AskDocumentResponse>(
      API_ROUTES.documents.ask(id),
      payload
    );
    return data;
  },

  /** POST /documents/{id}/embeddings */
  getEmbeddings: async (
    id: number | string,
    payload: AskDocumentRequest
  ): Promise<EmbeddingsResponse> => {
    const { data } = await apiClient.post<EmbeddingsResponse>(
      API_ROUTES.documents.embeddings(id),
      payload
    );
    return data;
  },
};
