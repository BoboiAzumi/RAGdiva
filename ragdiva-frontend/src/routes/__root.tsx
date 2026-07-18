import * as React from 'react'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import type { QueryClient } from '@tanstack/react-query'

export interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
      <TanStackRouterDevtools />
    </React.Fragment>
  )
}
