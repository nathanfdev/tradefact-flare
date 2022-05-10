import { Address } from './address-resource'

export interface Directory {
  activeOrders?: number
  activeShipments?: number
  addressCount?: number
  contactEmail?: string
  contactName?: string
  contactTelephone?: string
  currency?: string
  contactCount?: number
  id?: string
  invoiceAddress?: Address
  name?: string
  networkType?: string
  paymentTerms?: number
  tCs?: string
  taxId?: string
  source?: string
  status?: string
  countryInfo?: DirectoryCountryInfo[]
}

export interface DirectoryCountryInfo {
  countryCode: string
  countryName: string
}

export enum DirectoryType {
  Supplier = 'supplier',
  Buyer = 'buyer',
  Partner = 'partner',
  Shipper = 'shipper'
}
