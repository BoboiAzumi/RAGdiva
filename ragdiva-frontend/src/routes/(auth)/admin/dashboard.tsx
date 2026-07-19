import { AdminDashboardPage } from '@/pages/admin-dashboard-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/admin/dashboard')({
  component: AdminDashboardPage,
})