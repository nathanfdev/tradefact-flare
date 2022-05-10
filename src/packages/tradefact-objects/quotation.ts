import { LoadType } from './load-type-enum'
import { RouteSchedule } from './route-schedules'

export interface WayPoint {
  eta?: Date
  etd?: Date
  id?: string
  locationCode?: string
  name?: string
  geo?: number[]
  fullName?: string
  timezone?: string
}

export interface Carrier {
  id: string
}
export interface Service {
  id: string
}
export interface Vessel {
  id: string
}

export interface Leg {
  carrier?: Carrier
  fromPoint?: WayPoint
  toPoint?: WayPoint
  transportMode?: string
  service?: Service
  vessel?: Vessel
  voyageNumber?: string
  transitTime?: number
}

export interface Total {
  currencyId?: string
  discountAmount?: number
  netAmount?: number
  taxAmount?: number
  totalAmount?: number
}

export interface QuotationResource {
  issueDate?: Date
  expiryDate?: Date
  quoteNumber?: string
  contactName?: string
  contactReference?: string
  reference?: string
  totalQuantity?: number
  currencyId?: string
  exchangeRate?: number
  inverseExchangeRate?: number
  baseCurrencyTotalDiscountAmount?: number
  total?: Total
  baseCurrency?: Total
  quoteStatus?: boolean
  sent?: boolean
  sentByEmail?: boolean
  booked?: boolean
  notes?: string
  paymentTerms?: string
  defaultTerms?: string
  detailedTerms?: string
  routes?: RouteSchedule[]
  freightCharges?: QuotationChargeItemResource[]
  originCharges?: QuotationChargeItemResource[]
  destinationCharges?: QuotationChargeItemResource[]
  additionalCharges?: QuotationChargeItemResource[]
  paymentTermsDays?: number
  margin?: number
  validForDays?: number
  taxRate?: number
}

export interface QuotationChargeItemResource {
  seq?: number
  serviceId?: string
  description?: string
  quantity?: number
  unitPrice?: number
  unitPriceIncludesTax?: boolean
  taxRate?: number
  total?: Total
  baseCurrency?: Total
}
export interface QuoteCharge {
  charge: string
  currencyCode: string
  customCharge: string | null
  qty: number
  rate: number
  tax: number
  margin?: number
  isManual: boolean
}
export interface QuotationCreateRequest {
  isManualRoute?: boolean
  loadType?: LoadType
  additionalCharges: QuoteCharge[]
  destinationCharges: QuoteCharge[]
  freightCharges: QuoteCharge[]
  originCharges: QuoteCharge[]
  quotationRequestId: string
  routes: RouteSchedule[]
  taxRate: number
  terms: string
  validForDays: number
  validUntil: string
  currencyCode: string
  notes: string
  detailedTerms: string
  defaultTerms: string
  margin: number
  paymentTermsDays: number
}

export interface ShipmentCreateRequest {
  quotationRequestId: string
  route: RouteSchedule
}
