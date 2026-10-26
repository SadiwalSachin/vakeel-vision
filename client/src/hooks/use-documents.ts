"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { documentService } from "@/services/document.service";
import { QUERY_KEYS } from "@/constants/app.constants";
import type {
  DocumentUpdate,
  DocumentTextCreate,
  AskDocumentRequest,
} from "@/types/document.types";

/** GET /documents/ */
export function useDocuments() {
  return useQuery({
    queryKey: QUERY_KEYS.documents.list(),
    queryFn: documentService.list,
  });
}

/** GET /documents/{id} */
export function useDocument(id: number | string) {
  return useQuery({
    queryKey: QUERY_KEYS.documents.detail(id),
    queryFn: () => documentService.getById(id),
    enabled: !!id,
  });
}

/** GET /documents/{id}/content */
export function useDocumentContent(id: number | string) {
  return useQuery({
    queryKey: QUERY_KEYS.documents.content(id),
    queryFn: () => documentService.getContent(id),
    enabled: !!id,
  });
}

/** POST /documents/upload */
export function useUploadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => documentService.upload(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.documents.list() });
    },
  });
}

/** POST /documents/text */
export function useCreateTextDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: DocumentTextCreate) =>
      documentService.createFromText(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.documents.list() });
    },
  });
}

/** PATCH /documents/{id} */
export function useUpdateDocument(id: number | string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: DocumentUpdate) =>
      documentService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.documents.detail(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.documents.list() });
    },
  });
}

/** DELETE /documents/{id} */
export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => documentService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.documents.list() });
    },
  });
}

/** POST /documents/{id}/ask */
export function useAskDocument(id: number | string) {
  return useMutation({
    mutationFn: (payload: AskDocumentRequest) =>
      documentService.ask(id, payload),
  });
}

/** POST /documents/{id}/embeddings */
export function useDocumentEmbeddings(id: number | string) {
  return useMutation({
    mutationFn: (payload: AskDocumentRequest) =>
      documentService.getEmbeddings(id, payload),
  });
}
