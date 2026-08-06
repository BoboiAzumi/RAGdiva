import { AIModelsPage } from '@/pages/ai-models-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/admin/ai-models')({
  component: AIModelsPage,
})
