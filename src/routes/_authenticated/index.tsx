import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { AddProductButton } from '#/features/products/add-product-button'

export const Route = createFileRoute('/_authenticated/')({ component: Home })

function Home() {
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null)

  return (
    <main className="min-h-screen pb-40 p-4">
      <h1 className="text-2xl font-semibold">Accueil</h1>

      {lastScannedCode ? (
        <section className="mt-6 rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
          <p className="text-sm text-base-content/70">Dernier code scanné</p>
          <p className="mt-1 font-mono text-xl font-semibold">{lastScannedCode}</p>
        </section>
      ) : (
        <p className="mt-6 text-base-content/70">
          Scannez un code-barres pour l&apos;ajouter.
        </p>
      )}

      <AddProductButton onBarcodeScanned={setLastScannedCode} />
    </main>
  )
}
