import { AuthProviderContext } from "@/context/auth-context";
import { useAuth } from "@/hooks/use-auth";
import type { AuthProviderPropsType } from "@/types/auth-types";

export function AuthProvider({
    children,
    ...props
}: AuthProviderPropsType){
    const { userInfo, setUserInfo } = useAuth()

    return (
        <AuthProviderContext {...props} value={{ userInfo, setUserInfo }}>
            {children}
        </AuthProviderContext>
    )
}