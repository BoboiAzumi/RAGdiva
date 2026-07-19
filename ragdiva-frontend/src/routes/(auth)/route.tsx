import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProviderContext } from "@/context/auth-context";
import { authMeQueryOptions } from "@/features/queries/auth-queries";
import { isLogged } from "@/middleware/is-logged";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useContext } from "react";

export const Route = createFileRoute("/(auth)")({
    beforeLoad: isLogged,
    component: () => {
        const authContext = useContext(AuthProviderContext);
        const { data } = useSuspenseQuery(authMeQueryOptions());

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
