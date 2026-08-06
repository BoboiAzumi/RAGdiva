import { FileIngestionPage } from '@/pages/file-ingestion-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/admin/file-ingestion')({
  component: FileIngestionPage,
})
