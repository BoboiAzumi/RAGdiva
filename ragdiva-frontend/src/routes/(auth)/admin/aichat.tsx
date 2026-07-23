import { AIChatPage } from '@/pages/aichat-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/admin/aichat')({
  component: AIChatPage,
})
