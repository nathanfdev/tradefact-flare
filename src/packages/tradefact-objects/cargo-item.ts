import { FreightMovementProduct, Product } from './products'

export interface CargoItem {
  height?: number
  hsCode?: string
  itemId?: string
  length?: number
  productId?: string
  product?: Product
  qty?: number
  sku?: string
  uol?: string
  uow?: string
  weight?: number
  width?: number
  cartonQty?: number
  isProductVariant?: boolean
}

export const convertFreightMovementProductToCargoitem = (
  freightMovementProduct: FreightMovementProduct
): CargoItem => {
  return {
    height: freightMovementProduct.dimensions.height,
    hsCode: freightMovementProduct.hsCode,
    length: freightMovementProduct.dimensions.length,
    productId: freightMovementProduct.id,
    qty: freightMovementProduct.productQty,
    sku: freightMovementProduct.sku,
    uol: freightMovementProduct.dimensions.scale,
    uow: freightMovementProduct.dimensions.weightMeasurement,
    weight: freightMovementProduct.dimensions.weight,
    width: freightMovementProduct.dimensions.width,
    cartonQty: freightMovementProduct.cartonQty,
    isProductVariant: freightMovementProduct.isProductVariant
  }
}

export const createCargoItemList = (
  list: FreightMovementProduct[]
): CargoItem[] => {
  return list.map(product => convertFreightMovementProductToCargoitem(product))
}
