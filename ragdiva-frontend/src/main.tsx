import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { ThemeProvider } from "./providers/theme-providers";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./providers/auth-providers";
import { TooltipProvider } from "./components/ui/tooltip";

if (!crypto.randomUUID) {
    crypto.randomUUID = function (): `${string}-${string}-${string}-${string}-${string}` {
        const bytes = new Uint8Array(16);
        crypto.getRandomValues(bytes);
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}` as `${string}-${string}-${string}-${string}-${string}`;
    };
}

const queryClient = new QueryClient();
const router = createRouter({
    routeTree,
    context: {
        queryClient,
    },
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="ragdiva-ui-theme">
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    <TooltipProvider>
                        <RouterProvider router={router} />
                        <Toaster />
                    </TooltipProvider>
                </QueryClientProvider>
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>,
);
