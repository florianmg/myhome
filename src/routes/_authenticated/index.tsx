import { createFileRoute } from '@tanstack/react-router'

import { AddProductButton } from '#/features/products/add-product-button'

export const Route = createFileRoute('/_authenticated/')({ component: Home })

function Home() {
  return (
    <main className="min-h-screen pb-40 p-4">
      <h1 className="text-2xl font-semibold">Accueil</h1>

      <p className="mt-6 text-base-content/70">
        Scannez un code-barres pour l&apos;ajouter.
      </p>

      <AddProductButton />
    </main>
  )
}
