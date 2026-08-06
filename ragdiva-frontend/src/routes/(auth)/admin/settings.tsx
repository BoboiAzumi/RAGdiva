import { SettingsPage } from '@/pages/settings-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/admin/settings')({
  component: SettingsPage,
})
