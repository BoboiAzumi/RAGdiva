import { LoginPage } from '@/pages/login-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/login')({
  component: LoginPage,
})