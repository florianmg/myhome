import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth'

import { getFirebaseApp } from './client'

import type { Auth, User } from 'firebase/auth'

export interface AuthSnapshot {
  user: User | null
  isReady: boolean
}

const serverAuthSnapshot: AuthSnapshot = { user: null, isReady: false }

let clientAuthSnapshot: AuthSnapshot = { user: null, isReady: false }

function assertBrowser(): void {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Auth is only available in the browser')
  }
}

export function getFirebaseAuth(): Auth {
  assertBrowser()
  return getAuth(getFirebaseApp())
}

export async function signInWithGoogle(): Promise<User> {
  const auth = getFirebaseAuth()
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  return result.user
}

export async function signOutUser(): Promise<void> {
  await signOut(getFirebaseAuth())
}

export function subscribeToAuthState(onChange: () => void): () => void {
  assertBrowser()
  return onAuthStateChanged(getFirebaseAuth(), (user) => {
    clientAuthSnapshot = { user, isReady: true }
    onChange()
  })
}

export function getAuthSnapshot(): AuthSnapshot {
  if (typeof window === 'undefined') {
    return serverAuthSnapshot
  }

  return clientAuthSnapshot
}

export function getServerAuthSnapshot(): AuthSnapshot {
  return serverAuthSnapshot
}
