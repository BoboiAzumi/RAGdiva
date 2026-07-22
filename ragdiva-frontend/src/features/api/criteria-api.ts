import { apiClient } from "@/lib/api-client";
import type { CriteriaPostType, CriteriaResponseType } from "@/types/criteria-types";

export const criteriaApi = {
    getRoot: (q: string): Promise<CriteriaResponseType> => apiClient.get(`/criteria?q=${q}`),
    postRoot: (data: CriteriaPostType): Promise<{ message: string }> => apiClient.post(`/criteria`, data),
    patch: (data: CriteriaPostType & { id: string }): Promise<{ message: string }> => apiClient.patch(`/criteria/${data.id}`, data),
    delete: (data: string): Promise<{ message: string }> => apiClient.delete(`/criteria/${data}`)
}