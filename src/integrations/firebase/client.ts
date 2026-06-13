import { getApp, getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

import { firebaseConfig } from './config'

import type { FirebaseApp } from 'firebase/app'
import type { Firestore } from 'firebase/firestore'

let firebaseApp: FirebaseApp | undefined
let firestore: Firestore | undefined

function assertBrowser(): void {
  if (typeof window === 'undefined') {
    throw new Error('Firebase client is only available in the browser')
  }
}

export function getFirebaseApp(): FirebaseApp {
  assertBrowser()

  if (!firebaseApp) {
    firebaseApp =
      getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
  }

  return firebaseApp
}

export function getDb(): Firestore {
  if (!firestore) {
    firestore = getFirestore(getFirebaseApp())
  }

  return firestore
}
