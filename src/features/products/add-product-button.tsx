import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { BarcodeScannerModal } from './barcode-scanner-modal'
import { requestCameraAccess, stopCameraStream } from './camera-access'
import { ProductFormModal } from './product-form-modal'

import { fetchProductByBarcode } from '#/integrations/openfoodfacts/api'

type AddProductButtonProps = {
  onBarcodeScanned?: (barcode: string) => void
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Impossible de récupérer les informations du produit.'
}

export function AddProductButton({ onBarcodeScanned }: AddProductButtonProps) {
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isRequestingCamera, setIsRequestingCamera] = useState(false)
  const [pendingBarcode, setPendingBarcode] = useState<string | null>(null)

  const {
    data: fetchResult,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['openfoodfacts', 'product', pendingBarcode],
    queryFn: () => fetchProductByBarcode(pendingBarcode!),
    enabled: pendingBarcode !== null,
    staleTime: 5 * 60 * 1000,
  })

  const closeScanner = () => {
    if (cameraStream) {
      stopCameraStream(cameraStream)
      setCameraStream(null)
    }
    setIsScannerOpen(false)
  }

  const closeProductForm = () => {
    setPendingBarcode(null)
  }

  const handleOpenScanner = async () => {
    setCameraError(null)
    setIsRequestingCamera(true)

    const result = await requestCameraAccess()
    setIsRequestingCamera(false)

    if (!result.granted) {
      setCameraError(result.message)
      return
    }

    setCameraStream(result.stream)
    setIsScannerOpen(true)
  }

  const handleScan = (barcode: string) => {
    closeScanner()
    setPendingBarcode(barcode)
    onBarcodeScanned?.(barcode)
  }

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 flex flex-col gap-3 p-4">
        {cameraError && (
          <div role="alert" className="alert alert-error shadow-lg">
            <span>{cameraError}</span>
          </div>
        )}
        <button
          type="button"
          className="btn btn-primary w-full"
          disabled={isRequestingCamera}
          onClick={() => void handleOpenScanner()}
        >
          {isRequestingCamera ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            'Ajouter un produit'
          )}
        </button>
      </div>
      {isScannerOpen && cameraStream && (
        <BarcodeScannerModal
          stream={cameraStream}
          onClose={closeScanner}
          onScan={handleScan}
        />
      )}
      {pendingBarcode !== null && (
        <ProductFormModal
          barcode={pendingBarcode}
          fetchResult={fetchResult}
          isLoading={isLoading}
          isError={isError}
          errorMessage={isError ? getErrorMessage(error) : null}
          onClose={closeProductForm}
          onSubmit={closeProductForm}
        />
      )}
    </>
  )
}
