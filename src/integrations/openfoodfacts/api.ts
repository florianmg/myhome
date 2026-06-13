import type { FetchProductResult, OpenFoodFactsApiResponse } from './types'

const OPEN_FOOD_FACTS_BASE_URL = 'https://world.openfoodfacts.org'
const USER_AGENT = 'MyHome - Web - 1.0'

export async function fetchProductByBarcode(
  barcode: string,
): Promise<FetchProductResult> {
  const url = new URL(`/api/v2/product/${barcode}.json`, OPEN_FOOD_FACTS_BASE_URL)
  url.searchParams.set('fields', 'code,product_name,image_front_url,image_url')

  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
    },
  })

  if (!response.ok) {
    throw new Error(
      `Impossible de récupérer le produit (${response.status})`,
    )
  }

  const data = (await response.json()) as OpenFoodFactsApiResponse

  if (data.status !== 1 || !data.product) {
    return { found: false, barcode }
  }

  const { product } = data

  return {
    found: true,
    product: {
      barcode: product.code ?? barcode,
      name: product.product_name ?? '',
      imageUrl: product.image_front_url ?? product.image_url ?? null,
    },
  }
}
