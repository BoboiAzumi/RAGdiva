import type { AuthMeType } from "@/types/auth-types";
import { useState } from "react";

export function useAuth(){
    const [userInfo, setUserInfo] = useState<AuthMeType["data"] | null>(null)

    return {
        userInfo,
        setUserInfo
    }
}