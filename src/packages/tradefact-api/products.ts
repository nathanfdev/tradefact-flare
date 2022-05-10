import { fetchFromApi } from '.'
import { toast } from '../../helpers'
import {
  DeleteResponse,
  FreightMovementProduct,
  GenericResponse,
  HazardCode,
  Page,
  Product
} from '../tradefact-objects'

export type ListProductsOptions = {
  id?: string
  pageNumber?: number
  pageSize?: number
  search?: string
  sortBy?: string
}

export const listProducts = async (
  options?: ListProductsOptions
): Promise<Page<Product>> =>
  fetchFromApi('/product', options, {
    method: 'GET'
  })

export const refreshPrdoductList = (options?: ListProductsOptions) => {
  return listProducts(options).catch(() => {
    toast('Something went wrong', {
      title: 'Error',
      icon: 'danger'
    })
  })
}

export const deleteProduct = async (id: string): Promise<DeleteResponse> =>
  fetchFromApi('/product', { id }, { method: 'DELETE' })

export const addThumbnailImage = async (
  documentId: string,
  productId: string
): Promise<DeleteResponse> =>
  fetchFromApi(
    '/document/productmediadefaultimage',
    { documentId, productId },
    { method: 'PUT' }
  )

export const createProduct = async (newProduct: Product): Promise<Product> =>
  fetchFromApi('/product', undefined, {
    method: 'POST',
    body: JSON.stringify(newProduct)
  })

export const getProductById = async (id: string): Promise<Product> =>
  fetchFromApi(`/product/${id}`, undefined, {
    method: 'GET'
  })

export const updateProduct = async (
  updatedProduct: Product,
  id: string
): Promise<Product> =>
  fetchFromApi(
    '/product',
    { id },
    {
      method: 'PUT',
      body: JSON.stringify(updatedProduct)
    }
  )

export const listSupplierProducts = async (
  id: string,
  pageNumber?: number,
  pageSize?: number,
  search?: string
): Promise<Page<Product>> =>
  fetchFromApi(
    `/product/supplierproducts`,
    { id, pageNumber, pageSize, search },
    {
      method: 'GET'
    }
  )

export const importProductsFromFile = (body: {
  batchId: string
  supplierId?: string
  productId?: string
}): Promise<GenericResponse> =>
  fetchFromApi(`/task/flatfile/product/import`, undefined, {
    method: 'POST',
    body: JSON.stringify(body)
  })

export const convertProductToFreightMovementProduct = (
  product: Product,
  qty?: number
): FreightMovementProduct => {
  return {
    id: product.id ?? '',
    name: product.name,
    sku: product.sku,
    description: product.description,
    hsCode: product.hsCode,
    supplier: product.supplier ?? '',
    dimensions: {
      length:
        product.dimensions && product.dimensions.length
          ? product.dimensions.length
          : 0,
      width:
        product.dimensions && product.dimensions.width
          ? product.dimensions.width
          : 0,
      height:
        product.dimensions && product.dimensions.height
          ? product.dimensions.height
          : 0,
      scale:
        product.dimensions && product.dimensions.scale
          ? product.dimensions.scale
          : 'cm',
      weight:
        product.dimensions && product.dimensions.weight
          ? product.dimensions.weight
          : 0,
      weightMeasurement:
        product.dimensions && product.dimensions.weightMeasurement
          ? product.dimensions.weightMeasurement
          : 'kg'
    },
    hazardCode: product.hazardCode ? product.hazardCode : HazardCode.None,
    productQty: 0,
    cartonQty: qty ? qty : 0,
    lithiumBatteryPacking: product.lithiumBatteryPacking,
    magneticFieldContained: product.magneticFieldContained,
    hazardClass: product.hazardClass,
    hazardNotes: product.hazardNotes,
    hazardAttachment: product.hazardAttachment,
    unitsPerPackage: product.unitsPerPackage,
    supplierReference: product.supplierReference,
    hazardousContents: product.hazardousContents,
    packing: product.packing || '',
    isProductVariant: product.isProductVariant,
    unitPrice: product.unitPrice,
    unitQty: product.unitQty,
    poLineId: product.poLineId,
    barcode: product.barcode,
    identifier: {
      asin: product.identifier?.asin,
      ean: product.identifier?.ean,
      ePID: product.identifier?.ePID,
      gpc: product.identifier?.gpc,
      gtin: product.identifier?.gtin,
      isbn: product.identifier?.isbn,
      jan: product.identifier?.jan,
      mpn: product.identifier?.mpn,
      upc: product.identifier?.upc
    },
    stockQuantity: product.stockQuantity,
    incomingStockQuantity: product.incomingStockQuantity,
    minStockQuantity: product.minStockQuantity
  }
}
