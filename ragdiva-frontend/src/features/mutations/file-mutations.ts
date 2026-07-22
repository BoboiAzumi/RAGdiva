import { useMutation } from "@tanstack/react-query";
import { fileApi } from "../api/file-api";
import { queryClient } from "@/lib/query-context";
import { fileKeys } from "../keys/file-keys";

export function useFilePost(){
    return useMutation({
        mutationKey: fileKeys.all,
        mutationFn: fileApi.post,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: fileKeys.all })
        }
    })
}

export function useFilePatch(){
    return useMutation({
        mutationKey: fileKeys.all,
        mutationFn: fileApi.patch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: fileKeys.all })
        }
    })
}

export function useFileDelete(){
    return useMutation({
        mutationKey: fileKeys.all,
        mutationFn: fileApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: fileKeys.all })
        }
    })
}
