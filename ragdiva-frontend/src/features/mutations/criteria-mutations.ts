import { useMutation } from "@tanstack/react-query";
import { criteriaApi } from "../api/criteria-api";
import { queryClient } from "@/lib/query-context";
import { criteriaKeys } from "../keys/criteria-keys";

export function useCriteriaRoot(){
    return useMutation({
        mutationKey: criteriaKeys.all,
        mutationFn: criteriaApi.postRoot,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: criteriaKeys.all })
        }
    })
}

export function useCriteriaPatch(){
    return useMutation({
        mutationKey: criteriaKeys.all,
        mutationFn: criteriaApi.patch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: criteriaKeys.all })
        }
    })
}

export function useCriteriaDelete(){
    return useMutation({
        mutationKey: criteriaKeys.all,
        mutationFn: criteriaApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: criteriaKeys.all })
        }
    })
}

export function useCriteriaPost(){
    return useMutation({
        mutationKey: criteriaKeys.all,
        mutationFn: criteriaApi.post,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: criteriaKeys.all })
        }
    })
}