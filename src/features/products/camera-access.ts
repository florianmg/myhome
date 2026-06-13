export const CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  video: { facingMode: 'environment' },
}

export type CameraAccessResult =
  | { granted: true; stream: MediaStream }
  | { granted: false; message: string }

export async function getCameraPermissionState(): Promise<PermissionState | null> {
  if (!navigator.permissions?.query) {
    return null
  }

  try {
    const status = await navigator.permissions.query({
      name: 'camera' as PermissionName,
    })
    return status.state
  } catch {
    return null
  }
}

export async function requestCameraAccess(): Promise<CameraAccessResult> {
  if (!navigator.mediaDevices?.getUserMedia) {
    return {
      granted: false,
      message: 'Caméra non disponible sur cet appareil',
    }
  }

  const permissionState = await getCameraPermissionState()
  if (permissionState === 'denied') {
    return {
      granted: false,
      message:
        'Accès à la caméra refusé. Autorisez la caméra dans les paramètres du navigateur.',
    }
  }

  try {
    const stream =
      await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS)
    return { granted: true, stream }
  } catch (error) {
    const message =
      error instanceof DOMException && error.name === 'NotAllowedError'
        ? 'Accès à la caméra refusé'
        : error instanceof Error
          ? error.message
          : "Impossible d'accéder à la caméra"

    return { granted: false, message }
  }
}

export function stopCameraStream(stream: MediaStream): void {
  for (const track of stream.getTracks()) {
    track.stop()
  }
}
