import { authMeQueryOptions } from "@/features/queries/auth-queries";
import { destroySession } from "@/lib/session";
import type { RouterContext } from "@/routes/__root";
import { redirect } from "@tanstack/react-router";

export async function isLogged({ context }: { context: RouterContext }) {
    try {
        await context.queryClient.ensureQueryData(authMeQueryOptions());
    } catch {
        destroySession()
        throw redirect({
            to: `/login`,
        });
    }
}
