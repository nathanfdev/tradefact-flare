import { CargoItem } from './cargo-item'
import { FreightMovementProduct } from './products'

export interface LCLItem extends CargoItem {
  cartonQty?: number
  hazardCode?: string
  productPrice?: number
  productUnits?: number
}

export const convertFreightMovementProductToLCLItem = (
  freightMovementProduct: FreightMovementProduct
): LCLItem => {
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
    hazardCode: freightMovementProduct.hazardCode,
    isProductVariant: freightMovementProduct.isProductVariant,
    productPrice: freightMovementProduct.unitPrice,
    productUnits: freightMovementProduct.unitQty
  }
}

export const createLCLItemList = (
  list: FreightMovementProduct[]
): LCLItem[] => {
  return list.map(product => convertFreightMovementProductToLCLItem(product))
}
