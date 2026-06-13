import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useState } from 'react'

import { GoogleSignInButton } from '#/features/auth/google-sign-in-button'
import { useAuth } from '#/features/auth/use-auth'
import { signInWithGoogle } from '#/integrations/firebase'

export const Route = createFileRoute('/connexion')({
  component: ConnexionPage,
})

function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Une erreur est survenue lors de la connexion.'
}

function ConnexionPage() {
  const { user, isAuthReady } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" />
  }

  async function handleGoogleSignIn() {
    setIsLoading(true)
    setError(null)

    try {
      await signInWithGoogle()
    } catch (signInError) {
      setError(getAuthErrorMessage(signInError))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center gap-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">MyHome</h1>
            <p className="text-base-content/70">
              Connectez-vous avec votre compte Google pour accéder à votre
              espace.
            </p>
          </div>

          <GoogleSignInButton
            isLoading={isLoading}
            onClick={handleGoogleSignIn}
          />

          {error ? (
            <div role="alert" className="alert alert-error w-full text-left">
              <span>{error}</span>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}
