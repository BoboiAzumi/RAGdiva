import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/admin/dokumen-borang')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/admin/berkas"!</div>
}
