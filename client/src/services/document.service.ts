import { apiClient } from "@/lib/axios";
import { API_ROUTES } from "@/lib/api-routes";
import { Document } from "@/types/document.types";

export const documentService = {
  uploadPDFFile: async (payload:File):Promise<Document> => {
    const formData = new FormData()
    formData.append("file",payload)

    const {data} = await apiClient.post<Document>(
      API_ROUTES.documents.upload,
      formData
    )

    return data
  },

  getDocumentsList: async ():Promise<Document[]> => {
    const {data} = await apiClient.get<Document[]>(
      API_ROUTES.documents.list
    ) 
    return data
  }
}