import { useAuthentication } from "@/features/mutations/auth-mutations";
import { useState } from "react";

export function useLogin(){
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const post = useAuthentication()

    return {
        username, setUsername,
        password, setPassword,
        post
    }
}