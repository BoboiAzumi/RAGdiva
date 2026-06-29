import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/asesor/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/asesor/dashboard"!</div>
}
