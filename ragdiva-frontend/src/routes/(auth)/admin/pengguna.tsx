import { PenggunaPage } from '@/pages/pengguna-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/admin/pengguna')({
  component: PenggunaPage,
})
