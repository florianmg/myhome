export type OpenFoodFactsProduct = {
  barcode: string
  name: string
  imageUrl: string | null
}

export type FetchProductResult =
  | { found: true; product: OpenFoodFactsProduct }
  | { found: false; barcode: string }

type OpenFoodFactsApiResponse = {
  status: 0 | 1
  product?: {
    code?: string
    product_name?: string
    image_front_url?: string
    image_url?: string
  }
}

export type { OpenFoodFactsApiResponse }
