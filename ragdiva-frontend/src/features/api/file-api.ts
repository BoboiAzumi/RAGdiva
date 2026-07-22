import { apiClient } from "@/lib/api-client"
import type { FileResponseType } from "@/types/file-types"

export const fileApi = {
    get: (data: { criteriaId: string, q: string }): Promise<FileResponseType> => apiClient.get(`/file/${data.criteriaId}?q=${data.q}`),
    post: (data: { criteriaId: string, data: FormData }): Promise<{ message: string }> => apiClient.multipart(`/${data.criteriaId}`, data.data),
    patch: (data: { id: string, criteriaId: string, data: FormData }): Promise<{ message: string }> => apiClient.multipart(`/file/${data.criteriaId}/${data.id}`, data.data),
    delete: (data: { id: string, criteriaId: string }): Promise<{ message: string }> => apiClient.delete(`/file/${data.criteriaId}/${data.id}`),
}