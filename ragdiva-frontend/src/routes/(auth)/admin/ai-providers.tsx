import { AIProvidersPage } from '@/pages/ai-providers-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/admin/ai-providers')({
  component: AIProvidersPage,
})
