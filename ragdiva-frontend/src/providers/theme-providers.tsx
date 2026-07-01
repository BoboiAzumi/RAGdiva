import { ThemeProviderContext } from "@/context/theme-context";
import { useTheme } from "@/hooks/use-theme";
import type { Theme, ThemeProviderProps } from "@/types/theme-types";

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "ragdiva-ui-theme",
    ...props
}: ThemeProviderProps){
    const { theme, setTheme } = useTheme(storageKey, defaultTheme)

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)
        }
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}