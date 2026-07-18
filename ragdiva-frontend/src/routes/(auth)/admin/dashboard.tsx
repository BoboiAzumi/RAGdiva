import { AuthProviderContext } from '@/context/auth-context'
import { createFileRoute } from '@tanstack/react-router'
import { useContext } from 'react'

export const Route = createFileRoute('/(auth)/admin/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const authContext = useContext(AuthProviderContext)
  return <div>Hello {authContext.userInfo?.fullName}!</div>
}
