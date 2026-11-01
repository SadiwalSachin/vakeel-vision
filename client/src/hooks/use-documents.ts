import { useMutation, useQuery } from "@tanstack/react-query";
import { documentService } from "@/services/document.service";

export function useUploadPDFFile() {
  return useMutation({
    mutationFn: (payload: File) => documentService.uploadPDFFile(payload),
    onSuccess: (data) => {
      console.log(data);
    },
  });
}

export function useDocumentsList() {
  return useQuery({
    queryKey:["documents"],
    queryFn: () => documentService.getDocumentsList(),
    enabled:true
  })
}
