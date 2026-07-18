import { destroySession } from '@/lib/session'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/logout')({
  beforeLoad: () => {
    destroySession()
    throw redirect({
        to: "/login"
    })
  }
})
