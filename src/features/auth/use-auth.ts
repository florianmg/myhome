import { useSyncExternalStore } from 'react'

import {
  getAuthSnapshot,
  getServerAuthSnapshot,
  subscribeToAuthState,
} from '#/integrations/firebase/auth'

import type { AuthSnapshot } from '#/integrations/firebase/auth'
import type { User } from 'firebase/auth'

export function useAuth(): { user: User | null; isAuthReady: boolean } {
  const snapshot = useSyncExternalStore<AuthSnapshot>(
    subscribeToAuthState,
    getAuthSnapshot,
    getServerAuthSnapshot,
  )

  return { user: snapshot.user, isAuthReady: snapshot.isReady }
}
