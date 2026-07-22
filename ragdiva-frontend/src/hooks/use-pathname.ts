import { useRouterState } from "@tanstack/react-router";

export function usePathName(){
    const locationState = useRouterState({
        select: (state) => state.location,
    })

    return locationState;
}