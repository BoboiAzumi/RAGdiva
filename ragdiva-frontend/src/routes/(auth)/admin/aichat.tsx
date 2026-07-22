import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/admin/aichat')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/admin/aichat"!</div>
}
