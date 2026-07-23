import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProviderContext } from "@/context/auth-context";
import { criteriaKeys } from "@/features/keys/criteria-keys";
import { fileKeys } from "@/features/keys/file-keys";
import { authMeQueryOptions } from "@/features/queries/auth-queries";
import { isLogged } from "@/middleware/is-logged";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useContext, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/(auth)")({
    beforeLoad: isLogged,
    component: () => {
        const authContext = useContext(AuthProviderContext);
        const { data } = useSuspenseQuery(authMeQueryOptions());
        const queryClient = useQueryClient()

        useEffect(() => {
            const es = new EventSource("/api/stream")

            es.addEventListener('criteria', (e) => {
                const sse = JSON.parse(e.data)
                queryClient.invalidateQueries({ queryKey: criteriaKeys.all })
                toast(sse.message, { description: sse.data, position: "top-center" })
            })

            es.addEventListener('file', (e) => {
                const sse = JSON.parse(e.data)
                queryClient.invalidateQueries({ queryKey: fileKeys.all })
                toast(sse.message, { description: sse.data, position: "top-center" })
            })

        }, [])

        authContext.setUserInfo(data.data);

        return (
            <SidebarProvider>
                <SidebarLayout />
                <main className="w-full">
                    <DashboardNavbar />
                    <Outlet />
                </main>
            </SidebarProvider>
        );
    },
});
