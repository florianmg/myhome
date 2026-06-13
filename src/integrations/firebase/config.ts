// Renseigne ces valeurs depuis la console Firebase :
// Paramètres du projet → Vos applications → Config SDK
export const firebaseConfig = {
  apiKey: 'AIzaSyBQhrLHafjEI-H84vlFGXEslYEhLe0-U_g',
  authDomain: 'home-2914f.firebaseapp.com',
  projectId: 'home-2914f',
  storageBucket: 'home-2914f.firebasestorage.app',
  messagingSenderId: '976565153094',
  appId: '1:976565153094:web:41208a33b6ea6d69714947',
} as const

export type FirebaseConfig = typeof firebaseConfig
