import { AuthProviderContext } from '@/context/auth-context'
import { destroySession } from '@/lib/session'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useContext } from 'react'

export const Route = createFileRoute('/logout')({
  component: () => {
    destroySession()

    const queryClient = useQueryClient()
    const { setUserInfo } = useContext(AuthProviderContext)
    const navigate = useNavigate()

    queryClient.clear()
    setUserInfo(null)
    navigate({ to: "/login" })

    return <></>
  }
})
