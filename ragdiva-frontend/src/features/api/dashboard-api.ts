import { apiClient } from "@/lib/api-client";
import type { DashboardResponseType } from "@/types/dashboard-types";

export const dashboardApi = {
    get: (): Promise<DashboardResponseType> => apiClient.get("/")
}