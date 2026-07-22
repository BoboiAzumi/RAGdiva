import { queryOptions } from "@tanstack/react-query";
import { fileApi } from "../api/file-api";
import { fileKeys } from "../keys/file-keys";

export function fileQueryOptions(criteriaId: string, q: string){
    return queryOptions({
        queryFn: () => fileApi.get({ criteriaId, q }),
        queryKey: fileKeys.search(`${criteriaId}-${q}`)
    })
}
