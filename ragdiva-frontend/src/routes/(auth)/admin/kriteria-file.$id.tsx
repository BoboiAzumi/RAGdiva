import { KriteriaFilePage } from '@/pages/kriteria-file-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/admin/kriteria-file/$id')({
  component: KriteriaFilePage,
})
