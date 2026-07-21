import { Menu, Moon, Sun } from "lucide-react";
import { useThemeProvider } from "@/hooks/use-theme";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function Navbar() {
    const { setTheme } = useThemeProvider();

    return (
        <nav className="border-b border-b-border py-2 bg-background z-100 sticky top-0">
            <div className="max-w-280 m-auto px-6 flex justify-between">
                <div className="flex items-center gap-2">
                    <img
                        src="/logo.png"
                        alt="logo"
                        width={30}
                        height={30}
                        className="rounded-md"
                    />
                    <h1 className="text-text text-lg font-semibold">RAGDiva</h1>
                </div>
                <div className="md:flex items-center gap-7 hidden">
                    <a
                        href="#home"
                        className="text-text-light-800 dark:text-text-dark-300 hover:text-text-light-900 hover:dark:text-text-dark-200
                                    relative inline-block after:absolute after:left-0 after:bottom-0
                                    after:h-0.5 after:w-full after:origin-center after:scale-x-0
                                    after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100"
                    >
                        Home
                    </a>
                    <a
                        href="#"
                        className="text-text-light-800 dark:text-text-dark-300 hover:text-text-light-900 hover:dark:text-text-dark-200
                                    relative inline-block after:absolute after:left-0 after:bottom-0
                                    after:h-0.5 after:w-full after:origin-center after:scale-x-0
                                    after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100"
                    >
                        Profil
                    </a>
                    <a
                        href="#prodi"
                        className="text-text-light-800 dark:text-text-dark-300 hover:text-text-light-900 hover:dark:text-text-dark-200
                                    relative inline-block after:absolute after:left-0 after:bottom-0
                                    after:h-0.5 after:w-full after:origin-center after:scale-x-0
                                    after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100"
                    >
                        Program Studi
                    </a>
                    <a
                        href="#kontak"
                        className="text-text-light-800 dark:text-text-dark-300 hover:text-text-light-900 hover:dark:text-text-dark-200
                                    relative inline-block after:absolute after:left-0 after:bottom-0
                                    after:h-0.5 after:w-full after:origin-center after:scale-x-0
                                    after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100"
                    >
                        Kontak
                    </a>
                </div>
                <div className="md:flex items-center gap-2 hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="p-5" asChild>
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
                            <DropdownMenuItem
                                onClick={() => setTheme("system")}
                            >
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        className="bg-accent hover:bg-accent-light-500 dark:hover:bg-accent-dark-300 p-5 font-bold"
                        onClick={() => (document.location.href = "/login")}
                    >
                        Masuk
                    </Button>
                </div>
                <div className="md:hidden flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button>
                                <Menu className="text-text-dark" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center">
                            <DropdownMenuItem>
                                <a
                                    href="#home"
                                    className="text-text-light-800 dark:text-text-dark-300 hover:text-text-light-900 hover:dark:text-text-dark-200"
                                >
                                    Home
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <a
                                    href="#"
                                    className="text-text-light-800 dark:text-text-dark-300 hover:text-text-light-900 hover:dark:text-text-dark-200"
                                >
                                    Profil
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <a
                                    href="#prodi"
                                    className="text-text-light-800 dark:text-text-dark-300 hover:text-text-light-900 hover:dark:text-text-dark-200"
                                >
                                    Program Studi
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <a
                                    href="#kontak"
                                    className="text-text-light-800 dark:text-text-dark-300 hover:text-text-light-900 hover:dark:text-text-dark-200"
                                >
                                    Kontak
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <div className="flex justify-between items-center gap-1">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                            >
                                                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                                                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                                                <span className="sr-only">
                                                    Toggle theme
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    setTheme("light")
                                                }
                                            >
                                                Light
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => setTheme("dark")}
                                            >
                                                Dark
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    setTheme("system")
                                                }
                                            >
                                                System
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Button
                                        className="bg-accent hover:bg-accent-light-500 dark:hover:bg-accent-dark-30 w-full h-full p-1"
                                        onClick={() =>
                                            (document.location.href = "/login")
                                        }
                                    >
                                        Login
                                    </Button>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
}
