export interface Port {
  airport: boolean
  countryCode: string
  iata: string
  isGeneric: boolean
  locCode: string
  name: string
  port: boolean
  position: { latitude: number; longitude: number }
  rail: boolean
  road: boolean
}
