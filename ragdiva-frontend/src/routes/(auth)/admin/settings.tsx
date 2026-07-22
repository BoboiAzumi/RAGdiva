import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/admin/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/admin/settings"!</div>
}
