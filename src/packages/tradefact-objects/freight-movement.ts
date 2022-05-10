import { Address } from './address-resource'
import { CargoItem } from './cargo-item'
import { FCLItem } from './fcl-item'
import { ForwarderType } from './forwarder-type'
import { IncoType } from './inco-type-enum'
import { LCLItem } from './lcl-item'
import { LoadType } from './load-type-enum'
import { Port } from './port'
import { ShipmentType } from './shipment-type-enum'
import { TransactionType } from './transaction-type-enum'

export interface FreightMovement {
  name?: string
  tags?: string[]
  customsBrokerageRequired?: boolean
  deliveryDate?: Date
  fcl?: Array<FCLItem>
  goodsReady?: Date
  freightMovementId?: string
  incoTerms?: IncoType
  insuranceCurrency?: string
  insuranceRequired?: boolean
  insuranceValue?: number
  items?: Array<ScheduleItem>
  lcl?: Array<LCLItem>
  loadType?: LoadType
  notes?: string
  numberOfItems?: number
  placeOfDispatch?: string
  placeOfLoading?: string
  portOfDischarge?: string
  portOfLoading?: string
  placeOfDispatchInfo?: Address
  placeOfLoadingInfo?: Address
  portOfDischargeInfo?: Port
  portOfLoadingInfo?: Port
  reference?: string
  shipmentMethod: ShipmentType
  transactionType?: TransactionType
  supplierId?: string
  buyerId?: string
  hsCodes?: string[]
  consignmentQuantity: number
  purchaseOrderId: string
  forwarderList?: Array<QuoteRequestForwarderList>
  attachedSchedules?: string[]
  schedules?: Array<ScheduleGoodsReadyDates>
}

export interface ScheduleGoodsReadyDates {
  goodsReady?: string
  placeOfLoading?: string
  placeOfLoadingId: string
  scheduleName: string
}

export interface ScheduleItem {
  cargoItems?: Array<CargoItem>
  description: string
  freightMovementItemId: string
  goodsReady: string
  isPOSchedule: boolean
  placeOfLoadingId: string
  placeOfLoadingInfo?: Address
}

export interface QuoteRequestForwarderList {
  email?: string
  name: string
  partnershipId: string
  dateConnected?: Date
  type?: ForwarderType
}

export const createNewFreightMovement = () => {
  return {
    shipmentName: '',
    loadType: -1,
    transactionType: -1,
    shipmentMethod: -1,
    incoTerms: -1,
    placeOfLoading: '',
    portOfLoading: '',
    portOfLoadingName: '',
    portOfDischarge: '',
    portOfDischargeName: '',
    placeOfDispatch: '',
    goodsReady: '',
    deliveryDate: '',
    insuranceRequired: false,
    insuranceValue: 0,
    customsBrokerageRequired: false,
    numberOfCommodities: 0,
    notes: '',
    supplier: '',
    consignmentQuantity: 0,
    purchaseOrderId: ''
  }
}
