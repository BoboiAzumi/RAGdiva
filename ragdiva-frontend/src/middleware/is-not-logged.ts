import { authMeQueryOptions } from "@/features/queries/auth-queries";
import type { RouterContext } from "@/routes/__root";
import type { AuthMeType } from "@/types/auth-types";
import { redirect } from "@tanstack/react-router";

export async function isNotLogged({ context }: { context: RouterContext }) {
    let user: AuthMeType;
    try {
        user = await context.queryClient.ensureQueryData(authMeQueryOptions());
    } catch (e: unknown) {
        return;
    }

    if (user.data) {
        throw redirect({
            to: `/${user.data.level}/dashboard`,
        });
    }
}
