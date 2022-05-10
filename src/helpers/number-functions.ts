import { FCLItem, FreightMovementProduct } from '../packages/tradefact-objects'

export const HUNDRED_MILLION = 100000000
export const TEN_BILLION = 10000000000

export const formatCurrency = (value?: number): string => {
  let convertedValue = ''
  if (value) {
    convertedValue =  value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
  }
  return convertedValue;
}

export const roundNumber = (value: number): number => {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export interface Dimensions {
  length: number
  width: number
  height: number
  scale: string
  quantity: number
}
export const calculateCBM = ({
  length,
  width,
  height,
  scale,
  quantity
}: Dimensions): number => {
  if (scale.toUpperCase() === 'CM') {
    return roundNumber(((length * width * height) / 1000000) * quantity)
  } else if (scale.toUpperCase() === 'INCH') {
    return roundNumber(
      ((length * 2.5 * (width * 2.5) * (height * 2.5)) / 1000000) * quantity
    )
  } else {
    throw new Error('Not a valid scale')
  }
}

export const getCBMOfContainer = (container: FCLItem): number => {
  if (container.cargoItems?.length) {
    return container.cargoItems
      .map(item => {
        if (
          item.product?.dimensions?.length &&
          item.product?.dimensions?.height &&
          item.product?.dimensions?.width &&
          item.product?.dimensions?.scale &&
          item.cartonQty
        ) {
          return calculateCBM({
            length: item.product?.dimensions?.length,
            height: item.product?.dimensions?.height,
            width: item.product?.dimensions?.width,
            scale: item.product?.dimensions?.scale,
            quantity: Math.ceil(item.cartonQty / item.product?.unitsPerPackage)
          })
        } else {
          return 0
        }
      })
      .reduce((total, cbm) => (total += cbm), 0)
  } else {
    return 0
  }
}

export const getWeightOfProducts = (
  items: FreightMovementProduct[],
  weightMeasurement: string
) => {
  if (items.length) {
    const totalWeightKg: number = items
      .filter(
        product => product.dimensions?.weightMeasurement.toUpperCase() === 'KG'
      )
      .map(
        product =>
          (product.dimensions?.weight ?? 0) *
          (Math.ceil(product.cartonQty / product.unitsPerPackage) ?? 0)
      )
      .reduce((total, weight) => (total += weight), 0)

    const totalWeightLb: number = items
      .filter(
        product => product.dimensions?.weightMeasurement?.toUpperCase() === 'LB'
      )
      .map(
        product =>
          (product.dimensions?.weight ?? 0) *
          (Math.ceil(product.cartonQty / product.unitsPerPackage) ?? 0)
      )
      .reduce((total, weight) => (total += weight), 0)

    let returnValue = 0

    if (weightMeasurement.toUpperCase() === 'KG') {
      if (totalWeightLb > 0) {
        returnValue = totalWeightLb * 0.45359237
      }
      returnValue += totalWeightKg
    } else if (weightMeasurement.toUpperCase() === 'LB') {
      if (totalWeightKg > 0) {
        returnValue = totalWeightKg * 2.20462
      }
      returnValue += totalWeightLb
    } else {
      throw new Error('Not a valid weight measurement')
    }
    return roundNumber(returnValue)
  } else {
    return 0
  }
}

export const getWeightOfContainer = (
  container: FCLItem,
  weightMeasurement: string
) => {
  if (container.cargoItems?.length) {
    const totalWeightKg: number = container.cargoItems
      .filter(product => product.uow?.toUpperCase() === 'KG')
      .map(product => {
        if (product.cartonQty && product.product?.unitsPerPackage) {
          return (
            (product.product?.dimensions?.weight ?? 0) *
            (Math.ceil(product.cartonQty / product.product?.unitsPerPackage) ??
              0)
          )
        } else {
          return 0
        }
      })
      .reduce((total, weight) => (total += weight), 0)

    const totalWeightLb: number = container.cargoItems
      .filter(product => product.uow?.toUpperCase() === 'LB')
      .map(product => {
        if (product.cartonQty && product.product?.unitsPerPackage) {
          return (
            (product.product?.dimensions?.weight ?? 0) *
            (Math.ceil(product.cartonQty / product.product.unitsPerPackage) ??
              0)
          )
        } else {
          return 0
        }
      })
      .reduce((total, weight) => (total += weight), 0)

    let returnValue = 0

    if (weightMeasurement.toUpperCase() === 'KG') {
      if (totalWeightLb > 0) {
        returnValue = totalWeightLb * 0.45359237
      }
      returnValue += totalWeightKg
    } else if (weightMeasurement.toUpperCase() === 'LB') {
      if (totalWeightKg > 0) {
        returnValue = totalWeightKg * 2.20462
      }
      returnValue += totalWeightLb
    } else {
      throw new Error('Not a valid weight measurement')
    }
    return roundNumber(returnValue)
  }
  return 0
}

//(rate * quantity) / 100 * margin
export const calculateMargin = (
  _rate: number,
  _quantity: number,
  _marginPercent: number
): number => (((_rate || 0) * (_quantity || 0)) / 100) * (_marginPercent || 0)

//(rate * quantity) + Margin
export const calculateTotalAndMargin = (
  _rate: number,
  _quantity: number,
  _marginPercent: number
): number =>
  (_rate || 0) * (_quantity || 0) +
  calculateMargin(_rate || 0, _quantity || 0, _marginPercent || 0)

//TOTAL and Margin / 100 * tax rate
export const calcTax = (
  quantity: number,
  rate: number,
  taxRate: number,
  margin: number
): number =>
  (calculateTotalAndMargin(rate, quantity, margin) / 100) * (taxRate || 0)

// Returns lat and long of mid point between two coordinates
export const getMidPointCoOrd = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  let dLng = ((lng2 - lng1) * Math.PI) / 180

  lat1 = (lat1 * Math.PI) / 180
  lat2 = (lat2 * Math.PI) / 180
  lng1 = (lng1 * Math.PI) / 180

  let bX = Math.cos(lat2) * Math.cos(dLng)
  let bY = Math.cos(lat2) * Math.sin(dLng)
  let lat3 = Math.atan2(
    Math.sin(lat1) + Math.sin(lat2),
    Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY)
  )
  let lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX)

  return [lat3 * (180 / Math.PI), lng3 * (180 / Math.PI)]
}
