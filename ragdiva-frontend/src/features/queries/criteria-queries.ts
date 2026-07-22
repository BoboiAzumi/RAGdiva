import { queryOptions } from "@tanstack/react-query";
import { criteriaApi } from "../api/criteria-api";
import { criteriaKeys } from "../keys/criteria-keys";

export function criteriaQueryOptions(q: string){
    return queryOptions({
        queryFn: () => criteriaApi.getRoot(q),
        queryKey: criteriaKeys.search(q)
    })
}