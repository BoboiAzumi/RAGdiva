import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import { ThemeProvider } from "./providers/theme-providers";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./providers/auth-providers";

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
                    <RouterProvider router={router} />
                    <ReactQueryDevtools />
                    <Toaster />
                </QueryClientProvider>
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>,
);
