import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/user/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/user/dashboard"!</div>
}
