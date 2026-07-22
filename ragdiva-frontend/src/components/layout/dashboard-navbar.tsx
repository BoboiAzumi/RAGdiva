import { SidebarTrigger } from "../ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Moon, Sun, User } from "lucide-react";
import { useThemeProvider } from "@/hooks/use-theme";
import { useContext } from "react";
import { AuthProviderContext } from "@/context/auth-context";
import { useNavigate } from "@tanstack/react-router";

export function DashboardNavbar() {
    const { setTheme } = useThemeProvider();
    const { userInfo } = useContext(AuthProviderContext)
    const navigate = useNavigate()

    return (
        <nav className="bg-card border-b flex items-center justify-between p-2">
            <div className="flex items-center gap-1">
                <SidebarTrigger size={"lg"} />
                <h6 className="font-semibold">RAGDiva</h6>
            </div>
            <div className="flex mx-5 gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"outline"} size={"icon"}>
                            <User />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem disabled>
                            <p>{userInfo?.fullName}</p>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={() => navigate({ to: `/${userInfo?.level}/settings` })}>
                            Pengaturan
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate({ to: "/logout" })}>
                            Keluar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}
