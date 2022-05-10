import { TransactionType } from '.'
import { FreightMovement } from './freight-movement'
import { QuotationResource } from './quotation'
import { RouteSchedule } from './route-schedules'
import { ShipmentType } from './shipment-type-enum'

export interface MinimalShipment {
  freightMovement?: FreightMovement
  id: string
  placeOfLoading: string
  portOfLoading: string
  placeOfDischarge: string
  portOfDischarge: string
  incoterms: number
  shipmentType: ShipmentType
  loadType: number
  status: number
  stage: number
  reference: string
  partner: string
  client: string
  supplier: string
  name: string
  billofLadingNumber: string
  imo: string
  vesselName: string
  latitude: string
  longitude: string
  state: number
  submitted: Date
  collectionDate: Date
  booked: boolean
  bookedDate: Date
  collected: boolean
  estimatedCollectionDate: Date
  estimatedArrivalPOD: Date
  arrivedPOD: boolean
  departedPOL: boolean
  inTransit: boolean
  inTransitDate: Date
  equipmentTrackAvailable: boolean
  shipmentTrackAvailable: boolean
  inCustoms: boolean
  issueAtCustoms: boolean
  issueAtCustomsDate: Date
  issueAtCustomCleared: boolean
  customsClearence: boolean
  customsClearenceDate: Date
  delivered: boolean
  deliveryDate: Date
  trackinformationAdded: boolean
  tags: string[]
  tagsList: string[]
  shipmentStage: {
    arrivalPODConfirmed: boolean
    awaitingCollection: boolean
    awaitingCollectionDate: boolean
    awaitingTrackingInformation: boolean
    booked: boolean
    delivered: boolean
    departurePOLConfirmed: boolean
    inTransitToDestination: boolean
    inTransitToPort: boolean
    issueAtCustoms: boolean
    pendingCustoms: boolean
    shipping: boolean
  }
  hasExceptions?: boolean
  exceptions: string[]
  availableActions: ShipmentActions
  timeline: TimeLine
  scac: string
  arrivedPODDate: string
  departedPOLDate: string
  estimatedDeliveryDate: string
  estimatedDeparturePOL: Date
  estimatedArrivalPOL: Date
  quotation: QuotationResource
  route: RouteSchedule
  goodsReady: Date
  goodsReadyDates: Date[]
  goodsReadyMax: Date
  goodsReadyMin: Date
  equipment: string[]
  transactionType?: TransactionType
  isRescheduled: boolean
  rescheduled: number
  portOfLoadingCode?: string
  portOfDischargeCode?: string
  placeOfLoadingGeoCoordinate: {
    latitude: number
    longitude: number
  }
  placeOfDischargeGeoCoordinate: {
    latitude: number
    longitude: number
  }
  portOfLoadingGeoCoordinate: {
    latitude: number
    longitude: number
  }
  portOfDischargeGeoCoordinate: {
    latitude: number
    longitude: number
  }
  schedules: ShipmentSchedules[]
  noOfDocuments: number
  multiplePickupLocations: boolean
  multipleDropLocations: boolean
}

interface ShipmentSchedules {
  goodsReady: Date
  placeOfLoading: string
  placeOfLoadingId: string
  scheduleName: string
}

export interface ShipmentActions {
  editCollectionDate: boolean
  setCollectionDate: boolean
  recordCollected: boolean
  addTrackingInfo: boolean
  editTrackingInfo: boolean
  confirmDepartedPOL: boolean
  confirmArrivedPOD: boolean
  recordIssueAtCustoms: boolean
  clearCustoms: boolean
  setEstimatedDeliveryDate: boolean
  markDelivered: boolean
  suspend: boolean
  terminate: boolean
  reactivate: boolean
  complete: boolean
  archive: boolean
  editEstimatedDeliveryDate: boolean
  reschedule: boolean
  addSchedule: boolean
  addBolNumber: boolean
  editBolNumber: boolean
}

export enum ShipmentStatus {
  'Awaiting Collection' = 1, // Booked Active ?
  'In Transit To Port' = 2,
  'Shipping' = 3,
  'Pending Customs Clearance' = 4,
  'In Transit To Destination' = 5
}
export interface TimeLine {
  booked: BookingStage
  collection: TimeLineStage
  inTransit: InTransitStage
  customs: CustomsStage
  delivery: TimeLineStage
}

export interface TimeLineStage {
  state: EventClassifier
  dateTime: Date
}

export interface BookingStage extends TimeLineStage {
  goodsReady: Date
  estimatedCollection: Date
}

export interface InTransitStage extends TimeLineStage {
  inTransitToPOL: boolean
  shipping: boolean
  arrivedPOD: boolean
  trackingAvailable: boolean
}

export interface CustomsStage extends TimeLineStage {
  issueAtCustoms: boolean
  customsCleared: boolean
}

export interface Event {
  activity: Activity
  state: string
  location: Location
  dateTime: Date
  transport: Transport
}

export interface Activity {
  code: string
  name: string
}

export interface Location {
  name: string
}

export interface Transport {
  imoNumber: any
  carrier: string
  vessel: string
  voyage: string
}

//0 = Planned, 1 = Active, 2 = Complete
export interface EventClassifier {
  name: string
  id: number
}

export interface TrackingInfo {
  shipmentId: string
  vessel?: string | null
  vesselIMO?: string | null
  bolNumber: string
  carrier: string
  containerIds?: string[] | null
}

export interface ValidateContainerResponse {
  containerId: string
  isValid: boolean
}

export interface TransitInformation {
  id: string
  imo: string
  scac: string
  vesselName: string
}

export enum BookingsPageMode {
  active,
  exception,
  completed
}

export interface AISTrackingResultVessel {
  a: number
  b: number
  c: number
  callsign: string
  course: number
  d: number
  destination: string
  draught: number
  eca: boolean
  etA_AIS: string
  eta: string
  heading: number
  imo: number
  latitude: number
  longitude: number
  mmsi: number
  name: string
  navstat: number
  speed: number
  src: string
  timestamp: string
  type: number
  zone: string
}

export interface AISTrackingResult {
  vessels: AISTrackingResultVessel[]
  status: {
    isSuccess: boolean
    statusMessage: string
    statusCode: string
  }
  isSuccessStatusCode: boolean
  statusCode: string
}

export interface HereMapPortData {
  code: string
  name: string
  lat: number | null
  lng: number | null
  reference?: string
  exceptions?: string[]
  hasExceptions?: boolean
  destinationPosition?: Position
  id?: string
}

export interface Position {
  lat?: number | null
  lng?: number | null
}

export interface AirlineList {
  awbPrefix: string
  iata2LetterCcode: string
  name: string
  tracking: {
    enabled: boolean
  }
}

interface TrackingEvent {
  activity: string
  information: string
  location: string
  timeOfEvent: string
  voyage: string
}

export interface TrackingResource {
  billNumber: string
  container: string
  lastEvent: string
  lastEventTime: string
  trackingEvents: TrackingEvent[]
}

export const inviteOrganisation = () => {
  return {
    id: '',
    orgName: '',
    contactName: '',
    contactEmailAddress: ''
  }
}

export enum ShipmentsTab {
  QUOTE,
  PROGRESS,
  DOCUMENTS,
  CARGO,
  COMMENTS,
  TRACKING
}


export enum ShipmentsMobileView {
  'Progress' = 1, // Booked Active ?
  'Quote' = 2,
  'Documents' = 3,
  'Cargo' = 4,
  'Comments' = 5
}