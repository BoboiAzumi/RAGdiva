import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/admin/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/admin/dashboard"!</div>
}
