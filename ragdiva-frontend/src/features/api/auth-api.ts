import { apiClient } from "@/lib/api-client";
import type { AuthDataType, AuthMeType, AuthResponseType } from "@/types/auth-types";

export const authApi = {
    getMe: (): Promise<AuthMeType> => apiClient.get("/auth/me"),
    postAuthentication: (authData: AuthDataType): Promise<AuthResponseType> => apiClient.post("/auth", authData)
}