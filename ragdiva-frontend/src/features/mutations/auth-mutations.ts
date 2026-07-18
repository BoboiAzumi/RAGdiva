import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";

export function useAuthentication(){
    return useMutation({
        mutationFn: authApi.postAuthentication
    })
}