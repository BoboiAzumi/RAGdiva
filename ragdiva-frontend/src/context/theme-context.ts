import type { ThemeProviderState } from "@/types/theme-types";
import { createContext } from "react";

const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => null
}

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState)