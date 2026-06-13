import { createFileRoute } from '@tanstack/react-router'

import { AddProductButton } from '#/features/products/add-product-button'

export const Route = createFileRoute('/_authenticated/')({ component: Home })

function Home() {
  return (
    <main className="min-h-screen pb-24">
      <p>HOMEPAGE</p>
      <AddProductButton />
    </main>
  )
}
