import { Country } from './country'
import * as _ from 'lodash'

export interface Address {
  addressLine1?: string
  addressLine2?: string
  addressLine3?: string
  addressLine4?: string
  city?: string
  country?: Country
  countryCode?: string
  countryId?: string
  countryName?: string
  id?: string
  isDefault?: boolean
  contactName?: string
  name?: string
  postalCode?: string
  county?: string
  networkConnectionType?: string
  position?: LatLong
  savedAsName?: string
  saveAsName?: string // saveAsName & savedAsName are both on Address due to how Flare keeping reference to "savedAddresses" and "Addresses", but with the distinction being not entirely relevant
}

export interface NewAddressRequest {
  addressLine1: string
  addressLine2?: string
  addressLine3?: string
  addressLine4?: string
  city: string
  contactName: string
  countryCode: string
  county: string
  latitude?: number
  longitude?: number
  postalCode: string
  province: string
  saveAsName: string
}

export interface LatLong {
  latitude: number
  longitude: number
}
