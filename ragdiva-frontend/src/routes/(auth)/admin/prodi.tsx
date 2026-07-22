import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/admin/prodi')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/admin/prodi"!</div>
}
