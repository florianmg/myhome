import { useCallback, useRef, useState } from 'react'

type ScannerState =
  | { status: 'loading' }
  | { status: 'ready' }
  | { status: 'error'; message: string }

type BarcodeScannerModalProps = {
  stream: MediaStream
  onClose: () => void
  onScan: (barcode: string) => void
}

type ScannerControls = {
  stop: () => void
}

function isNotFoundError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false
  }

  return error.name === 'NotFoundException'
}

export function BarcodeScannerModal({
  stream,
  onClose,
  onScan,
}: BarcodeScannerModalProps) {
  const onCloseRef = useRef(onClose)
  const onScanRef = useRef(onScan)
  onCloseRef.current = onClose
  onScanRef.current = onScan

  const controlsRef = useRef<ScannerControls | null>(null)
  const initStartedRef = useRef(false)
  const [state, setState] = useState<ScannerState>({ status: 'loading' })

  const cleanupScanner = useCallback(() => {
    controlsRef.current?.stop()
    controlsRef.current = null
    initStartedRef.current = false
  }, [])

  const handleClose = useCallback(() => {
    cleanupScanner()
    onCloseRef.current()
  }, [cleanupScanner])

  const initScanner = useCallback(
    async (video: HTMLVideoElement) => {
      if (initStartedRef.current) {
        return
      }

      initStartedRef.current = true

      try {
        const { BrowserMultiFormatReader } = await import('@zxing/browser')
        const reader = new BrowserMultiFormatReader()

        const controls = await reader.decodeFromStream(
          stream,
          video,
          (result, error) => {
            if (result) {
              controlsRef.current?.stop()
              controlsRef.current = null
              onScanRef.current(result.getText())
              return
            }

            if (error && !isNotFoundError(error)) {
              console.error(error)
            }
          },
        )

        controlsRef.current = controls
        setState({ status: 'ready' })
      } catch (error) {
        initStartedRef.current = false
        const message =
          error instanceof Error
            ? error.message
            : "Impossible d'accéder à la caméra"
        setState({ status: 'error', message })
      }
    },
    [stream],
  )

  const videoRefCallback = useCallback(
    (video: HTMLVideoElement | null) => {
      if (video) {
        void initScanner(video)
        return
      }

      cleanupScanner()
    },
    [cleanupScanner, initScanner],
  )

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box flex max-h-dvh w-full max-w-none flex-col gap-4 rounded-none p-4 sm:max-w-lg sm:rounded-box">
        <h2 className="text-lg font-semibold">Scanner un code-barres</h2>

        {state.status === 'error' ? (
          <div role="alert" className="alert alert-error">
            <span>{state.message}</span>
          </div>
        ) : (
          <div className="relative aspect-video overflow-hidden rounded-lg bg-base-300">
            <video
              ref={videoRefCallback}
              className="size-full object-cover"
              autoPlay
              muted
              playsInline
            />
            {state.status === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center bg-base-300/80">
                <span className="loading loading-spinner loading-lg" />
              </div>
            )}
          </div>
        )}

        <button type="button" className="btn btn-outline" onClick={handleClose}>
          Annuler
        </button>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={handleClose}>
          fermer
        </button>
      </form>
    </dialog>
  )
}
