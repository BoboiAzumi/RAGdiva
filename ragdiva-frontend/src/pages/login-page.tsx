import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useLogin } from "@/hooks/use-login";
import { useTitle } from "@/hooks/use-title";
import { setSession } from "@/lib/session";
import { User, Lock } from "lucide-react"; // Menambahkan ikon Lock untuk password
import type { ReactNode } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export function LoginPage(): ReactNode {
    useTitle("Masuk RAGDiva");
    
    const loginHook = useLogin()
    const navigate = useNavigate()

    return (
        <main className="bg-background min-h-screen flex justify-center items-center p-4 sm:p-8">
            <div className="w-full max-w-sm bg-surface-2-light-100 dark:bg-surface-dark-800 p-6 sm:p-8 rounded-xl border shadow-lg">
                
                <div className="flex flex-col space-y-1.5 text-center mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight">Selamat Datang</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Masuk ke akun Anda untuk melanjutkan
                    </p>
                </div>
                <form className="space-y-4" onSubmit={
                    (e) => e.preventDefault()
                }>
                    <InputGroup>
                        <InputGroupInput placeholder="Username" type="text" value={loginHook.username} onChange={(e) => loginHook.setUsername(e.target.value)} />
                        <InputGroupAddon>
                            <User className="w-4 h-4 text-gray-500" />
                        </InputGroupAddon>
                    </InputGroup>
                    <InputGroup>
                        <InputGroupInput placeholder="Password" type="password" value={loginHook.password} onChange={(e) => loginHook.setPassword(e.target.value)} />
                        <InputGroupAddon>
                            <Lock className="w-4 h-4 text-gray-500" />
                        </InputGroupAddon>
                    </InputGroup>
                    <Button 
                        type="submit" 
                        className="w-full bg-accent hover:bg-accent-800 dark:hover:bg-accent-200 mt-2"
                        onClick={
                            () => loginHook.post.mutate({ username: loginHook.username, password: loginHook.password }, {
                                onError: (error) => {
                                    toast.error("Couldn't login", { description: error.message })
                                },
                                onSuccess: (data) => {
                                    setSession((data.data as { token: string}).token)
                                    toast.success("Login Successfully")
                                    setTimeout(() => navigate({
                                        to: "/login"
                                    }), 1000)
                                }
                            })
                        }
                    >
                        Masuk
                    </Button>
                </form>
            </div>
        </main>
    );
}