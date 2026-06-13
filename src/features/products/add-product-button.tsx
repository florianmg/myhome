import { useState } from 'react'

import { BarcodeScannerModal } from './barcode-scanner-modal'

export function AddProductButton() {
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [scannedProduct, setScannedProduct] = useState<string | null>(null)

  const handleScan = (barcode: string) => {
    console.log('Barcode scanné:', barcode)
    setIsScannerOpen(false)
    setScannedProduct(barcode)
  }

  return (
    <>
      {scannedProduct && (
        <div className="fixed inset-x-0 bottom-0 p-4">
          <p>Produit scanné: {scannedProduct}</p>
        </div>
      )}
      <div className="fixed inset-x-0 bottom-0 p-4">
        <button
          type="button"
          className="btn btn-primary w-full"
          onClick={() => setIsScannerOpen(true)}
        >
          Ajouter un produit
        </button>
      </div>
      {isScannerOpen && (
        <BarcodeScannerModal
          onClose={() => setIsScannerOpen(false)}
          onScan={handleScan}
        />
      )}
    </>
  )
}
