import { queryOptions } from "@tanstack/react-query";
import { dashboardKeys } from "../keys/dashboard-keys";
import { dashboardApi } from "../api/dashboard-api";

export function dashboardQueryOptions(){
    return queryOptions({
        queryKey: dashboardKeys.all,
        queryFn: dashboardApi.get
    })
}