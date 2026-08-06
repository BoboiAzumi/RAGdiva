import { AIEmbeddingPage } from '@/pages/ai-embedding-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/admin/ai-embedding')({
  component: AIEmbeddingPage,
})

