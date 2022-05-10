export interface Contact {
  id?: string
  fullName?: string
  email?: Email
  phone?: PhoneNumber
  department?: string
  locationId?: string
  locationName?: string
  supplier?: string
  networkConnectionType?: string
}

export interface Email {
  email?: string
  isDefault?: boolean
}

export interface PhoneNumber {
  areaCode?: string
  countryCode?: string
  isDefault?: boolean
  number?: string
}
