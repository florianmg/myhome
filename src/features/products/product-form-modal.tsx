import { useState } from 'react'

import { formatDateInput } from './format-date-input'

import type { FetchProductResult } from '#/integrations/openfoodfacts/types'

type ProductFormModalProps = {
  barcode: string
  fetchResult: FetchProductResult | undefined
  isLoading: boolean
  isError: boolean
  errorMessage: string | null
  onClose: () => void
  onSubmit: () => void
}

type ProductFormContentProps = {
  barcode: string
  fetchResult: FetchProductResult | undefined
  isError: boolean
  errorMessage: string | null
  onClose: () => void
  onSubmit: () => void
}

function ProductFormContent({
  barcode,
  fetchResult,
  isError,
  errorMessage,
  onClose,
  onSubmit,
}: ProductFormContentProps) {
  const initialName = fetchResult?.found ? fetchResult.product.name : ''
  const initialImageUrl = fetchResult?.found
    ? fetchResult.product.imageUrl
    : null

  const [name, setName] = useState(initialName)
  const [openedDate, setOpenedDate] = useState(() =>
    formatDateInput(new Date()),
  )
  const [expiryDate, setExpiryDate] = useState('')

  const showNotFoundMessage = !isError && fetchResult?.found === false

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {isError && errorMessage ? (
        <div role="alert" className="alert alert-error">
          <span>{errorMessage}</span>
        </div>
      ) : null}

      {showNotFoundMessage ? (
        <div role="status" className="alert alert-info">
          <span>
            Produit non trouvé dans Open Food Facts. Vous pouvez saisir les
            informations manuellement.
          </span>
        </div>
      ) : null}

      <div className="flex justify-center">
        {initialImageUrl ? (
          <img
            src={initialImageUrl}
            alt={name || 'Produit scanné'}
            className="h-32 w-32 rounded-lg object-contain bg-base-200"
          />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-base-200 text-base-content/50">
            Aucune image
          </div>
        )}
      </div>

      <label className="form-control w-full">
        <span className="label">
          <span className="label-text">Nom</span>
        </span>
        <input
          type="text"
          className="input input-bordered w-full"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nom du produit"
        />
      </label>

      <label className="form-control w-full">
        <span className="label">
          <span className="label-text">Code-barres</span>
        </span>
        <input
          type="text"
          className="input input-bordered w-full font-mono"
          value={barcode}
          readOnly
        />
      </label>

      <label className="form-control w-full">
        <span className="label">
          <span className="label-text">Date d&apos;ouverture</span>
        </span>
        <input
          type="date"
          className="input input-bordered w-full"
          value={openedDate}
          onChange={(event) => setOpenedDate(event.target.value)}
          required
        />
      </label>

      <label className="form-control w-full">
        <span className="label">
          <span className="label-text">Date de péremption</span>
        </span>
        <input
          type="date"
          className="input input-bordered w-full"
          value={expiryDate}
          onChange={(event) => setExpiryDate(event.target.value)}
        />
      </label>

      <div className="flex flex-col gap-2 sm:flex-row-reverse">
        <button type="submit" className="btn btn-primary flex-1">
          Valider
        </button>
        <button type="button" className="btn btn-outline flex-1" onClick={onClose}>
          Annuler
        </button>
      </div>
    </form>
  )
}

export function ProductFormModal({
  barcode,
  fetchResult,
  isLoading,
  isError,
  errorMessage,
  onClose,
  onSubmit,
}: ProductFormModalProps) {
  return (
    <dialog open className="modal modal-open">
      <div className="modal-box flex max-h-dvh w-full max-w-none flex-col gap-4 rounded-none p-4 sm:max-w-lg sm:rounded-box">
        <h2 className="text-lg font-semibold">Ajouter un produit</h2>

        {isLoading ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <span className="loading loading-spinner loading-lg" />
            <p className="text-base-content/70">Recherche du produit…</p>
          </div>
        ) : (
          <ProductFormContent
            key={barcode}
            barcode={barcode}
            fetchResult={fetchResult}
            isError={isError}
            errorMessage={errorMessage}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        )}

        {isLoading ? (
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Annuler
          </button>
        ) : null}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>
          fermer
        </button>
      </form>
    </dialog>
  )
}
