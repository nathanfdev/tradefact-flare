import {
  FreightMovementProduct,
  FCLItem,
  CargoItem,
  Product
} from '../../packages/tradefact-objects'
import {
  formatCurrency,
  roundNumber,
  calculateCBM,
  Dimensions,
  calculateMargin,
  calcTax,
  getMidPointCoOrd,
  getCBMOfContainer,
  getWeightOfProducts,
  getWeightOfContainer
} from '../number-functions'
describe('format Currency function test cases', () => {
  const testCasesForFormatCurrency: [number, string][] = [
    [0, ''],
    [-2345.4, '-2,345.40'],
    [56.83, '56.83'],
    [2345, '2,345.00']
  ]
  test.each(testCasesForFormatCurrency)(
    'given currency %p  currency return formated currency %p',
    (firstArgument, expectedResult) => {
      const result = formatCurrency(firstArgument)
      expect(result).toEqual(expectedResult)
    }
  )
})

describe('Round number function  test cases', () => {
  const testCasesForRoundNumber: [number, number][] = [
    [0, 0],
    [123, 123],
    [89.5434, 89.54],
    [89.0897, 89.09]
  ]
  test.each(testCasesForRoundNumber)(
    'given number %p and return round of value %p',
    (firstArgument, expectedResult) => {
      const result = roundNumber(firstArgument)
      expect(result).toEqual(expectedResult)
    }
  )
})

describe('calculate CBM function', () => {
  const testCasesForCalculateCBM: [Dimensions, number][] = [
    [
      {
        length: 12,
        width: 4,
        height: 34,
        scale: 'cm',
        quantity: 345
      } as Dimensions,
      0.56
    ],
    [
      {
        length: 12,
        width: 4.5,
        height: 34.9,
        scale: 'CM',
        quantity: 345
      },
      0.65
    ],
    [
      {
        length: 12,
        width: 4,
        height: 34,
        scale: 'INCH',
        quantity: 345
      },
      8.8
    ],
    [
      {
        length: 12,
        width: 4,
        height: 34,
        scale: 'inch',
        quantity: 345
      },
      8.8
    ]
  ]
  const wrongScaleValue = {
    length: 12,
    width: 4,
    height: 34,
    scale: 'inchrt',
    quantity: 345
  }
  test.each(testCasesForCalculateCBM)(
    'given dimention %p  return  %p',
    (firstArgument, expectedResult) => {
      const result = calculateCBM(firstArgument)
      expect(result).toEqual(expectedResult)
    }
  )
  test('given wrong scale throws invalid scale error', () => {
    expect(() => {
      calculateCBM(wrongScaleValue)
    }).toThrow('Not a valid scale')
  })
})

describe('calculate margin function  test cases', () => {
  const marginParameter: [number, number, number, number][] = [
    [2, 334, 2, 13.36],
    [0, 0, 0, 0],
    [0, 343, 2, 0],
    [4.9, 34.5, 2.9, 4.90245]
  ]
  test.each(marginParameter)(
    'given rate %p,  quantity %p, marginPercent %p  as argument return calculated margin as %p',
    (rate, quantity, marginPercent, expectedResult) => {
      const result = calculateMargin(rate, quantity, marginPercent)
      expect(result).toEqual(expectedResult)
    }
  )
})

describe('calculate tax function  test cases', () => {
  const taxParameter: [number, number, number, number, number][] = [
    [2, 334, 2, 13.36, 15.144896],
    [0, 0, 0, 0, 0],
    [0, 343, 2, 0, 0],
    [4.9, 34.5, 2.9, 4.90245, 5.142790160025]
  ]
  test.each(taxParameter)(
    'given quantity %p, rate %p, taxRate %p,  margin %p  as argument return calculated tax as %p',
    (quantity, rate, taxRate, marginPercent, expectedResult) => {
      const result = calcTax(quantity, rate, taxRate, marginPercent)
      expect(result).toEqual(expectedResult)
    }
  )
})

describe('calculate mid point cords function  test cases', () => {
  const latlongValues: [number, number, number, number, number, number][] = [
    [
      223.33,
      33344.33,
      34344322.55,
      353533.454545,
      -41.42987915639682,
      33508.20096746505
    ],
    [
      0,
      0,
      -41.42987915639682,
      33508.20096746505,
      -21.28903812352992,
      12.043138349165394
    ],
    [0, 0, 0, 0, 0, 0]
  ]
  test.each(latlongValues)(
    'given lat1 %p, long1 %p, lat2 %p,  long2 %p  as argument return mid point lat %p long %p',
    (lat1, long1, lat2, long2, expectedlat, expectedlong) => {
      const result = getMidPointCoOrd(lat1, long1, lat2, long2)
      expect(result).toStrictEqual([expectedlat, expectedlong])
    }
  )
})

describe('calculate total Weight Of Products function test cases', () => {
  test('given item length is 0 return total weight is 0', () => {
    expect(getWeightOfProducts([], 'kg')).toBe(0)
  })
  const fixtureData = {} as FreightMovementProduct
  const productInkg: FreightMovementProduct[] = [
    {
      ...fixtureData,
      dimensions: {
        height: 1,
        length: 1,
        width: 2,
        scale: 'cm',
        weight: 5,
        weightMeasurement: 'kg'
      },
      cartonQty: 680,
      unitsPerPackage: 2
    }
  ]
  test('given item Product weightMeasurement in Kg return total weight in Kg', () => {
    expect(getWeightOfProducts(productInkg, 'kg')).toEqual(1700)
  })
  test('given item Product weightMeasurement in Kg return total weight in Lb', () => {
    expect(getWeightOfProducts(productInkg, 'Lb')).toEqual(3747.85)
  })

  const productInLb: FreightMovementProduct[] = [
    {
      ...fixtureData,
      dimensions: {
        height: 1,
        length: 1,
        width: 2,
        scale: 'cm',
        weight: 5,
        weightMeasurement: 'lb'
      },
      cartonQty: 680,
      unitsPerPackage: 2
    }
  ]
  test('given item Product weightMeasurement in Lb return total weight in Lb', () => {
    expect(getWeightOfProducts(productInLb, 'lb')).toEqual(1700)
  })

  test('given item Product weightMeasurement in Lb return total weight in Kg', () => {
    expect(getWeightOfProducts(productInLb, 'kg')).toEqual(771.11)
  })
  test('given wrong weight measure throws weight measure error', () => {
    expect(() => {
      getWeightOfProducts(productInLb, 'rt')
    }).toThrow('Not a valid weight measurement')
  })
})

describe('Calculate total weight of container function test cases', () => {
  test('given item length is 0 return total weight is 0', () => {
    expect(getWeightOfContainer({}, 'kg')).toBe(0)
  })
  const containerfixtureData = {} as FCLItem
  const cargofixtureData = {} as CargoItem
  const productFixtureData = {} as Product
  const cargoInKg: CargoItem = {
    ...cargofixtureData,
    uow: 'kg',
    weight: 1,
    cartonQty: 890
  }

  const containerInkg: FCLItem = {
    ...containerfixtureData,
    cargoItems: [
      {
        ...cargoInKg,
        product: {
          ...productFixtureData,
          unitsPerPackage: 1,
          dimensions: {
            weight: 1
          }
        }
      }
    ]
  }
  const unitsPerPackage0KgCase: FCLItem = {
    ...containerfixtureData,
    cargoItems: [
      {
        ...cargoInKg,
        product: {
          ...productFixtureData,
          unitsPerPackage: 0,
          dimensions: {
            weight: 1
          }
        }
      }
    ]
  }

  test('given item Product weightMeasurement in Kg return total weight in Kg', () => {
    expect(getWeightOfContainer(containerInkg, 'KG')).toBe(890)
  })
  test('given item Product weightMeasurement in KG return total weight in LB', () => {
    expect(getWeightOfContainer(containerInkg, 'LB')).toBe(1962.11)
  })
  test('given item Product units Per Package 0 in KG case return total weight 0', () => {
    expect(getWeightOfContainer(unitsPerPackage0KgCase, 'LB')).toBe(0)
  })

  const cargoInLb: CargoItem = {
    ...cargofixtureData,
    uow: 'Lb',
    weight: 1,
    cartonQty: 890
  }
  const containerInLb: FCLItem = {
    ...containerfixtureData,
    cargoItems: [
      {
        ...cargoInLb,
        product: {
          ...productFixtureData,
          unitsPerPackage: 1,
          dimensions: {
            weight: 1
          }
        }
      }
    ]
  }
  const unitsPerPackage0LbCase: FCLItem = {
    ...containerfixtureData,
    cargoItems: [
      {
        cartonQty: 890,
        uow: 'Lb',
        product: {
          ...productFixtureData,
          unitsPerPackage: 0,
          dimensions: {
            weight: 1
          }
        }
      }
    ]
  }
  const cartonQty0LbCase: FCLItem = {
    ...containerfixtureData,
    cargoItems: [
      {
        cartonQty: 0,
        uow: 'Lb',
        product: {
          ...productFixtureData,
          unitsPerPackage: 900,
          dimensions: {
            weight: 1
          }
        }
      }
    ]
  }
  test('given item Product weightMeasurement in Lb return total weight in Lb', () => {
    expect(getWeightOfContainer(containerInLb, 'lb')).toEqual(890)
  })

  test('given item Product weightMeasurement in Lb return total weight in Kg', () => {
    expect(getWeightOfContainer(containerInLb, 'kg')).toEqual(403.7)
  })

  test('given item Product units Per Package 0 in KG case return total weight 0', () => {
    expect(getWeightOfContainer(unitsPerPackage0LbCase, 'LB')).toBe(0)
  })

  test('given cart quantity is  0 in cargo item  return total weight 0', () => {
    expect(getWeightOfContainer(cartonQty0LbCase, 'LB')).toBe(0)
  })

  test('given wrong weight measure throws weight measure error', () => {
    expect(() => {
      getWeightOfContainer(containerInLb, 'rt')
    }).toThrow('Not a valid weight measurement')
  })
})

describe('Calculate CBM of container function test cases', () => {
  const containerfixtureData = {} as FCLItem
  const productFixtureData = {} as Product

  const cargoItemLength0: FCLItem = {
    ...containerfixtureData,
    cargoItems: []
  }
  const CBMOfContainer: FCLItem = {
    ...containerfixtureData,
    cargoItems: [
      {
        cartonQty: 5670,
        product: {
          ...productFixtureData,
          unitsPerPackage: 1,
          dimensions: {
            height: 3,
            length: 343,
            scale: 'cm',
            weight: 34,
            weightMeasurement: 'kg',
            width: 343
          }
        }
      },
      {
        cartonQty: 20,
        product: {
          ...productFixtureData,
          unitsPerPackage: 1,
          dimensions: {
            height: 22,
            length: 23,
            scale: 'cm',
            weight: 1,
            weightMeasurement: 'kg',
            width: 23
          }
        }
      },
      {
        cartonQty: 780,
        product: {
          ...productFixtureData,
          unitsPerPackage: 1,
          dimensions: {
            height: 1,
            length: 1,
            scale: 'cm',
            weight: 11,
            weightMeasurement: 'kg',
            width: 1
          }
        }
      }
    ]
  }

  const cartonQty0Case = {
    ...containerfixtureData,
    cargoItems: [
      {
        cartonQty: 0,
        product: {
          ...productFixtureData,
          unitsPerPackage: 1,
          dimensions: {
            height: 3,
            length: 343,
            scale: 'cm',
            weight: 34,
            weightMeasurement: 'kg',
            width: 343
          }
        }
      }
    ]
  }
  const dimensionHeight0 = {
    ...containerfixtureData,
    cargoItems: [
      {
        cartonQty: 30,
        product: {
          ...productFixtureData,
          unitsPerPackage: 1,
          dimensions: {
            height: 0,
            length: 343,
            scale: 'cm',
            weight: 34,
            weightMeasurement: 'kg',
            width: 343
          }
        }
      }
    ]
  }
  test('given  cargo item length 0  data and return 0', () => {
    expect(getCBMOfContainer(cargoItemLength0)).toBe(0)
  })
  test('given  FCLItem data and return CBM Of Container', () => {
    expect(getCBMOfContainer(CBMOfContainer)).toBe(2001.44)
  })
  test('given  FCLItem cart quantity is 0  and return 0', () => {
    expect(getCBMOfContainer(cartonQty0Case)).toBe(0)
  })
  test('given height in Dimensions is 0  and return 0', () => {
    expect(getCBMOfContainer(dimensionHeight0)).toBe(0)
  })
})
