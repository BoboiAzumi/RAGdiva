import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/admin/kriteria-file')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/admin/kriteria-file"!</div>
}
