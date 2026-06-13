import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

import { useAuth } from '#/features/auth/use-auth'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { user, isAuthReady } = useAuth()

  if (!isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/connexion" />
  }

  return <Outlet />
}
