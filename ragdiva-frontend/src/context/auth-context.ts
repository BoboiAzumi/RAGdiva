import type { AuthContextType } from "@/types/auth-types";
import { createContext } from "react";

const initialAuth: AuthContextType = {
    userInfo: null,
    setUserInfo: () => {}
}

export const AuthProviderContext = createContext<AuthContextType>(initialAuth)