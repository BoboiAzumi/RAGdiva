import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useTitle } from "@/hooks/use-title";
import { User, Lock } from "lucide-react"; // Menambahkan ikon Lock untuk password
import type { ReactNode } from "react";

export function LoginPage(): ReactNode {
    useTitle("Masuk RAGDiva");

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
                        <InputGroupInput placeholder="Username" type="text" />
                        <InputGroupAddon>
                            <User className="w-4 h-4 text-gray-500" />
                        </InputGroupAddon>
                    </InputGroup>
                    <InputGroup>
                        <InputGroupInput placeholder="Password" type="password" />
                        <InputGroupAddon>
                            <Lock className="w-4 h-4 text-gray-500" />
                        </InputGroupAddon>
                    </InputGroup>
                    <Button 
                        type="submit" 
                        className="w-full bg-accent hover:bg-accent-800 dark:hover:bg-accent-200 mt-2"
                    >
                        Masuk
                    </Button>
                </form>
            </div>
        </main>
    );
}