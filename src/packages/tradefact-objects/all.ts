/* eslint-disable @typescript-eslint/camelcase */
import { FreightMovementProduct, HazardCode } from './products'

export interface Page<T> {
  items: T[]
  paging: {
    currentPage?: number
    hasNext: boolean
    hasPrevious: boolean
    pageSize: number
    totalCount: number
    totalPages: number
    page: number
  }
}
export interface PortInfo {
  code: string
  country: string
  countryCode?: string
  name: string
}

export interface Container {
  containerId: string
  size?: string
  hazardCode?: HazardCode
  products: FreightMovementProduct[]
}

export enum BillingStatus {
  Pending,
  Paid
}

export enum BillingType {
  Sea,
  Air
}

export interface Billing {
  activityName: string
  id: string
  type: BillingType
  issue: Date
  due: Date
  status: BillingStatus
  amount: number
  vat: number
  totalPrice: number
}

export interface QuoteLoad {
  x20ft: number
  x40ft: number
  x40HQ: number
  x45HQ: number
}

export interface Quote {
  importId: string
  activityName: string
  quotationId: string
  freightType: 'sea' | 'air'
  terms: 'EXW' | 'FOB'
  fromSupplier: string
  toCompanyAddress: string
  load: QuoteLoad
  status: string
}

export interface Supplier {
  supplierId: string
  name: string
  country: string
}

export interface User {
  id?: string
  email: string
  familyName?: string
  givenName?: string
  fullname: string
  phoneNumber: string
  picture?: string
  role?: [string]
  sub?: string
  locationId?: string
  status?: string
  isExposedToOtherOrganization: boolean
}

export interface ContainerType {
  active: boolean
  additionalInformation: string
  code: string
  description: string
  height: string
  isoLengthCode: string
  isoSecondSizeCode: string
  isoTypeCode: string
  isoTypeGroup: string
  isoTypeGroupDescription: string
  length: string
  width: string
}

export interface DeleteResponse {
  detail: string
  extensions: {}
  instance: string
  status: number
  title: string
  type: string
}

export interface AdditionalCharge {
  purchaseAdditionalChargeItemId: string
  description?: string
  rate?: number
  type?: string
}

export interface AdditionalTax {
  purchaseAdditionalChargeItemId: string
  description?: string
  rate?: number
  type?: string
}

export interface GenericResponse {
  description: string
  id: string
  result: string
  status: string
}
export interface Freight {
  icon: string
  label: string
  value: number
}
