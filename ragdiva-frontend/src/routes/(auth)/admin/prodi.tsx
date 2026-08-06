import { ProdiPages } from '@/pages/prodi-pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/admin/prodi')({
  component: ProdiPages,
})

