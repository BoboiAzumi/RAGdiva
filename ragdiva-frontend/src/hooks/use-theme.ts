import { ThemeProviderContext } from "@/context/theme-context";
import type { Theme } from "@/types/theme-types";
import { useContext, useEffect, useState } from "react";

export function useTheme(storageKey: string, defaultTheme: string){
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    )

    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove("light", "dark")

        if(theme === "system"){
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches ? 
                    "dark" : "light"
            
            root.classList.add(systemTheme)
            return
        }

        root.classList.add(theme)
    },  [theme])

    return { theme, setTheme }
}

export function useThemeProvider(){
    const context = useContext(ThemeProviderContext)

    if(context === undefined){
        throw new Error("useThemeProvider must be used within a ThemeProvider")
    }

    return context
}