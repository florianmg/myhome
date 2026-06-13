import { useState } from 'react'

import { BarcodeScannerModal } from './barcode-scanner-modal'
import { requestCameraAccess, stopCameraStream } from './camera-access'

type AddProductButtonProps = {
  onBarcodeScanned?: (barcode: string) => void
}

export function AddProductButton({ onBarcodeScanned }: AddProductButtonProps) {
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isRequestingCamera, setIsRequestingCamera] = useState(false)
  const [scannedProduct, setScannedProduct] = useState<string | null>(null)

  const closeScanner = () => {
    if (cameraStream) {
      stopCameraStream(cameraStream)
      setCameraStream(null)
    }
    setIsScannerOpen(false)
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
    setScannedProduct(barcode)
    onBarcodeScanned?.(barcode)
  }

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 flex flex-col gap-3 p-4">
        {scannedProduct && (
          <div role="status" className="alert alert-success shadow-lg">
            <span>
              Code scanné :{' '}
              <span className="font-mono font-semibold">{scannedProduct}</span>
            </span>
          </div>
        )}
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
    </>
  )
}
