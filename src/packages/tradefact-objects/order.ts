import { LatLong } from './address-resource'
import { Country } from './country'
import { DropdownOptionType } from './dropdown-resource'
import { UserInfo } from './user'

export enum Steps {
  SHIPMENT = 'SHIPMENT',
  DELIVERY = 'DELIVERY',
  SETUP = 'SETUP',
  SUMMARY = 'SUMMARY'
}

export interface NewOrderRequest {
  deliveryAddressId: string
  destinationAddressId: string
  lineItems: LineItemRequest[] | []
  referenceNumber: string
  referenceType: DropdownOptionType<any> | null
  shipmentDate: string
  shipmentName: string
  transportMode: DropdownOptionType<any> | null
}

export interface LineItemRequest {
  labelText: string
  lineNumber: string
}
export interface AllOrder {
  deliveryAddress: DeliveryAddress
  destinationAddress: DestinationAddress
  id: string
  lineItems: OrderLineItem[]
  orderStatus: string
  referenceNumber: string
  referenceType: string
  shipmentDate: string
  shipmentName: string
  transportMode: string
  orderedBy: string
  orderDate: string
}

interface LastDeviceReport {
  battery?: number
  gpsAddress: string
  gpsAlarm: string
  gpsAltitude: number
  gpsDirection: number
  gpsIsPrecise: true
  gpsLatitude: number
  gpsLongitude: number
  gpsRecvTime: string
  gpsSpeed: number
  gpsStatus: string
  gpsTime: string
  gpsUseLbslocation: true
  humidity?: number
  temperature?: number
}

export interface OrderLineItemDevice {
  deviceId: string
  deviceType: string
  hasFault: true
  id: string
  imei: string
  imsi: string
  lastDeviceReport: LastDeviceReport
  msisdn: string
  serialNumber: string
  simProvider: string
}

export interface OrderLineItem {
  device: OrderLineItemDevice
  id: string
  labelText: string
  lineNumber: number
}
interface DeliveryAddress {
  addressLine1: string
  addressLine2: string
  addressLine3: string
  addressLine4: string
  city: string
  country: Country
  county: string
  id: string
  isDefault: boolean
  name: string
  networkConnectionType: string
  position: LatLong
  postalCode: string
  province: string
}

interface DestinationAddress {
  addressLine1: string
  addressLine2: string
  addressLine3: string
  addressLine4: string
  city: string
  country: Country
  county: string
  id: string
  isDefault: true
  name: string
  networkConnectionType: string
  position: LatLong
  postalCode: string
  province: string
}

export interface FlarePriceList {
  price: number
  sku: string
  title: string
}
export interface Device {
  orderId: string
  deviceId: string
  lat: number
  lng: number
  deliveryLong: number
  deliveryLat: number
  lastUpdated: string
  battery?: number
  temperature?: number
  humidity?: number
  deviceLabel: string
  referenceNumber: string
  countryOfDelivery: string
  countryOfDestination: string
  isSelected: boolean
  status: string
  shipmentName: string
}

export interface FilteredOrder {
  id: string
  reference: string
  isSelected: boolean
  deviceList: Device[]
  status: string
}

export enum OrderStatus {
  AwaitingFulfillment = 0,
  TrackingActive = 1,
  TrackingComplete = 2,
  None = 3
}

export interface AllOrderQuery {
  search?: string
  userInfo?: UserInfo | null
  pageNumber?: number
}

export interface FiltersResponse {
  originCountries: Country[]
  destinationCountries: Country[]
}

export interface CountryFilters {
  originCountries: Country[]
  destinationCountries: Country[]
  selectedOrigin: Country
  selectedDestination: Country
}

export enum OrderReferenceType {
  PurchaseOrderNumber = 0,
  ShipmentBookingNumber = 1
}

export interface EarliestShipmentDate {
  earliestDate: string
  workingDays: number
}
