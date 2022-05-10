import { Address } from './address-resource'
import { FCLItem } from './fcl-item'
import { IncoType } from './inco-type-enum'
import { LCLItem } from './lcl-item'
import { LoadType } from './load-type-enum'
import { Port } from './port'
import { Document, Product } from './products'
import { PurchaseOrderCharge } from './purchase-order-charge'
import { PurchaseOrderDocument } from './purchase-order-document'
import { ShipmentType } from './shipment-type-enum'
import { TransactionType } from './transaction-type-enum'
import moment = require('moment')

export interface SubmitPurchaseOrder {
  contacts: string[]
  notes: string
  submissionDate: string
  submitted: boolean
}

export interface AcceptPurchaseOrder {
  acceptanceDate: string
  accepted: boolean
}

export interface InProductionPurchaseOrder {
  inProduction: boolean
  productionStateChangeDate: string
}

export interface PreShipmentPurchaseOrder {
  preProduction: boolean
  preProductionStateChangeDate: string
}

export interface ShippedPurchaseOrder {
  shipping: boolean
  shippingStateChangeDate: string
}

export interface RejectPurchaseOrder {
  notes?: string
  rejected: boolean
  rejectionDate: string
}

export interface CompletePurchaseOrder {
  complete: boolean
  completionDate: string
}

export interface AttachPurchaseOrderDocument {
  attached: boolean
  description?: string
  documentId: string
  extension?: string
  isRichText: boolean
  name?: string
  productId: string
  documentType: number
}

export interface SubmitPurchaseOrderItem {
  AllProducts?: boolean
  linkedOnly?: boolean
  orderPriceUnit?: string
  productId?: string
  purchaseOrderItemId?: string
  supplierReference?: string
  supplierId?: string
}

export interface SubmitPurchaseOrderItemList {
  orderPriceUnit?: number
  orderQuantity?: number
  productId: string
  purchaseOrderQuantityUnit?: string
  supplierReference?: string
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

export interface SubmitPurchaseOrderCharge {
  purchaseAdditionalChargeItemId?: string
  description?: string
  quantity?: number
  rate?: number
  type: string
}

export interface PatchPurchaseOrder {
  value: string[] | string | number | boolean
  op: string
  path: string
}

export interface CreatePurchaseOrder {
  currencyId: string
  poNumber?: string
  supplierId?: string
}

export interface UpdatePurchaseOrder {
  goodsReadyDate?: string
  targetDeliveryDate?: string
  incoTerms?: string
  loadType?: string
  placeOfDispatchId?: string
  placeOfLoadingId?: string
  portOfDischargeId?: string | null
  portOfLoadingId?: string | null
  purchaseOrderDate?: string
  reference?: string
  shipmentType?: string
  supplierId?: string
  transactionType?: string
  signature?: string
  paymentTerms?: string
  tags?: string[]
  dateOfIssue?: string
  currencyId?: string
  additionalInformation?: string
  hsCodes?: string[]
  productHSCodes?: string[]
  customsBrokerageRequired?: boolean
  insuranceCurrency?: string
  insuranceRequired?: boolean
  insuranceValue?: number
  notes?: string
  containers?: string[]
  client?: string
  incoTermsDesc?: string
}

export interface UpdatePurchaseOrderItem {
  orderPriceUnit: number
  orderQuantity: number
  productId: string
  supplierReference: string
}

export interface PurchaseOrderActivity {
  description: string
  eventTime: string
  fullName: string
  profileImage: string
  purchaseOrderId: string
}

export interface PurchaseOrderTimeline {
  submitted: boolean
  submittedDate: string
  accepted: boolean
  acceptedDate: string
  inProduction: boolean
  inProductionDate: string
  preShipment: boolean
  preShipmentDate: string
  shipped: boolean
  shippedDate: string
  rejected: boolean
  rejectedDate: string
  cancelled: boolean
  cancelledDate: string
  completed: boolean
  completedDate: string
}

export interface PurchaseOrderActions {
  edit: boolean
  submit: boolean
  reject: boolean
  cancel: boolean
  reset: boolean
  delete: boolean
  isOwned: boolean
  addGoodsReadyDate: boolean
  editGoodsReadyDate: boolean
  setProductionStatus: boolean
  setShippingStatus: boolean
  requestShippingQuotation: boolean
}

export interface PurchaseOrderImport {
  description: string
  id: string
  result: string
  status: string
}

export interface PurchaseOrderItem {
  accountAssignmentCategory: string
  isCompletelyDelivered: boolean
  isFinallyInvoiced: boolean
  isProductVariant: boolean
  itemNetWeight: number
  itemVolume: number
  itemVolumeUnit: string
  itemWeightUnit: string
  netPriceAmount: number
  netPriceQuantity: number
  orderPriceUnit: string
  orderQuantity: number
  scheduleLineCommittedQuantity: number
  remainingQuantity: number
  product: Product
  purchaseContract: string
  purchaseOrderId: string
  purchaseOrderItemCategory: string
  purchaseOrderItemId: string
  purchaseOrderItemText: string
  purchaseOrderQuantityUnit: string
  sku: string
  supplierReference: string
  taxCode: string
  taxCountry: string
  taxDeterminationDate: string
  taxJurisdiction: string
  orderShipmentStatus: number
  airShipments: number
  seaShipments: number
  roadShipments: number
  schedules: PurchaseOrderSchedule[]
  shipments: PurchaseOrderShipments
  noShipments: number
  noSchedules: number
}

export interface PurchaseOrder {
  id: string
  poNumber?: string
  supplier: {
    activeOrders: number
    addressCount: number
    contactEmail: string
    contactName: string
    contactTelephone: string
    currency: string
    id: string
    name: string
    paymentTerms: number
    tCs: string
  }
  supplierId: string
  placeOfLoading: Address
  placeOfLoadingInfo?: Address
  placeOfDispatch: Address
  placeOfDispatchInfo?: Address
  creationDate?: Date
  lastModifiedDate?: Date
  createdByName?: string
  purchaseOrderDate?: Date
  goodsReadyDate?: Date
  targetDeliveryDate?: Date
  reference?: string
  tags?: string[]
  shipmentType?: ShipmentType
  portOfDischarge?: {
    code: string
    name: string
  }
  portOfLoading?: {
    code: string
    name: string
  }
  portOfDischargeInfo?: Port
  portOfLoadingInfo?: Port
  fcl?: Array<FCLItem>
  loadType?: LoadType
  lcl?: Array<LCLItem>
  currencyCode?: string
  charge?: AdditionalCharge
  tax?: AdditionalTax
  additionalInformation?: string
  paymentTerms?: string
  incoTerms?: IncoType
  invoicePlace?: string
  placeOfIssue?: string
  dateOfIssue?: Date
  approvePo?: boolean
  notesForSupplier?: string
  transactionType?: TransactionType
  transactionTypeDesc?: string
  purchaseOrderNotes?: string
  status?: number
  timeline?: PurchaseOrderTimeline
  availableActions: PurchaseOrderActions
  purchaseOrderItems?: { product: PurchaseOrderItem; orderPriceUnit: string }[]
  destinationCharges?: PurchaseOrderCharge[]
  documents?: PurchaseOrderDocument[]
  logisticsNotes?: string
  activity?: PurchaseOrderActivity[]
  signature?: string
  itemsTotal?: {
    currencyId: string
    discountAmount: number
    netAmount: number
    taxAmount: number
    totalAmount: number
  }
  total?: {
    currencyId: string
    discountAmount: number
    netAmount: number
    taxAmount: number
    totalAmount: number
  }
  containers?: string[]
  hsCodes?: string[]
  customsBrokerageRequired?: boolean
  insuranceCurrency?: string
  insuranceRequired?: boolean
  insuranceValue?: number
  notes?: string
  productHSCodes?: string[]
  numberOfItems?: number
  rejectedReason?: string
  orderRejected?: boolean
  attachments?: number
  noSchedules?: number
  noShipments?: number
  shipmentsBooked?: number
  shipmentsDelivered?: number
  shipmentsInTransit?: number
  client?: string
  incoTermsDesc?: string
  schedules?: PurchaseOrderSchedule
  shipments?: PurchaseOrderShipments[]
  airShipments?: number
  seaShipments?: number
  railShipments?: number
  roadShipments?: number
  orderShipmentStatus: number
  viewerURL: string
  deletionDate?: string
}

export interface PurchaseOrderQuote {
  client: string
  goodsReady: string
  id: string
  incoterms: number
  isRevision: boolean
  loadType: number
  name: string
  partner: string
  placeOfDischarge: string
  placeOfLoading: string
  portOfDischarge: string
  portOfLoading: string
  reference: string
  revision: number
  schedules: [
    {
      goodsReady: Date
      id: string
      placeOfLoading: string
      placeOfLoadingId: string
      scheduleName: string
    }
  ]
  shipmentType: number
  state: number
  submitted: string
}

export interface PurchaseOrderShipments {
  arrivedPOD: boolean
  arrivedPODDate: boolean
  availableActions: {}
  billTracking: []
  billTrackingAvailable: boolean
  billofLadingNumber: number
  client: string
  collectionDate: string
  deliveryDate: string
  departedPOL: string
  departedPOLDate: string
  equipment: []
  estimatedArrivalPOD: string
  estimatedDeliveryDate: string
  estimatedDeparturePOL: string
  exceptions: []
  freightMovement: boolean
  freightMovementId: string
  goodsReady: string
  id: string
  imo: string
  incoterms: number
  isRescheduled: boolean
  lastRescheduleTime: string
  loadType: number
  name: string
  partner: string
  placeOfDischarge: string
  placeOfLoading: string
  portOfDischarge: string
  portOfDischargeCode: string
  portOfDischargeGeoCoordinate: string
  portOfLoading: string
  portOfLoadingCode: string
  portOfLoadingGeoCoordinate: string
  quotation: []
  quotationRequestId: string
  reference: string
  rescheduled: number
  route: string
  scac: string
  shipmentType: number
  stage: string
  state: number
  status: number
  submitted: string
  supplier: string
  tags: []
  timeline: {}
  transactionType: number
  vesselName: string
  schedules: [
    {
      goodsReady: Date
      id: string
      placeOfLoading: string
      placeOfLoadingId: string
      scheduleName: string
    }
  ]
  booked: boolean
}

export interface PurchaseOrderSchedule {
  confirmedGoodsReadyDate: string
  description: string
  purchaseOrderId: string
  scheduleId: string
  length: string
  supplier?: string
  itemQty?: number
  placeOfLoading?: SchedulePlaceOfLoading
  value?: OrderValue
}

export enum PurchaseOrdersPageMode {
  active,
  drafts,
  rejected,
  completed,
  allNoDrafts,
  schedules,
  deleted
}

export enum OrderType {
  purchase,
  sales
}

export enum QuotationStateEnum {
  PENDING = 0,
  READY = 1,
  ACCEPTED = 2,
  EXPIRED = 3,
  REJECTED = 4
}

export enum PurchaseOrderTabs {
  PURCHASEORDER = 'ORDER',
  PRODUCTS = 'PRODUCTS',
  SHIPPING = 'SHIPPING',
  SCHEDULES = 'SCHEDULES',
  DOCUMENTS = 'DOCUMENTS',
  COMMENTS = 'COMMENTS',
  ACTIVITY = 'ACTIVITY'
}

export interface ShippingQuote {
  customsBrokerageRequired?: boolean
  hsCodes?: string[]
  insuranceCurrency?: string
  insuranceRequired?: boolean
  insuranceValue?: number
  targetDeliveryDate?: Date
}

interface SchedulePortOfLoading extends Port {
  country: ScheduleCountry
}

interface ScheduleCountry {
  code2: string
  code3: string
  locations: Port[]
  name: string
}

export interface SchedulePlaceOfLoading {
  addressLine1: string
  addressLine2: string
  addressLine3: string
  addressLine4: string
  city: string
  country: ScheduleCountry
  countryCode: string
  county: string
  creationDateInternal: string
  id: string
  isActive: boolean
  isDefault: boolean
  isInvoiceAddress: boolean
  lastChangeUser: string
  lastModifiedOn: string
  lastModifiedOnInternal: string
  name: string
  postalCode: string
  province: string
  streetAddress: string
  type: number
}

export interface SchedulesOverview {
  goodsReady: string
  itemQty: number
  lines: number
  portOfLoading: SchedulePortOfLoading
  placeOfLoading: SchedulePlaceOfLoading
  purchaseOrderId: string
  purchaseOrderNumber: string
  reference: string
  scheduleLineId: string
  supplier: string
  name: string
  items: ScheduleProduct[]
  checked?: boolean
  value: OrderValue
  isLocked: boolean
}
export interface ScheduleProduct {
  countryofLoadingCode: string
  createdByUser: string
  creationDateInternal: string
  lastChangeUser: string
  lastModifiedOnInternal: string
  portOfLoadingCode: string
  productId: Product
  requestedDeliveryDate: string
  scheduleLineCommittedQuantity: number
  scheduleLineOrderQuantity: number
  scheduleLineOrderWeight: number
}

export const createPurchaseOrder = () => {
  return {
    id: '',
    poNumber: '',
    loadType: -1,
    shipmentType: -1,
    incoTerms: -1,
    transactionType: -1,
    placeOfLoading: '',
    portOfLoadingCode: '',
    portOfDischargeCode: '',
    portOfLoadingName: '',
    portOfDischargeName: '',
    placeOfDispatch: '',
    goodsReadyDate: '',
    targetDeliveryDate: '',
    purchaseOrderDate: '',
    dateOfIssue: moment().format('YYYY-MM-DD'),
    supplier: '',
    supplierId: '',
    reference: '',
    additionalInformation: '',
    paymentTerms: '',
    currency: 'USD',
    placeOfIssue: '',
    invoicePlace: '',
    approvePo: false,
    notesForSupplier: '',
    customsBrokerageRequired: false,
    insuranceRequired: false,
    insuranceValue: 0,
    numberOfCommodities: 0,
    hsCodes: '',
    onHsCodesChange: '',
    productsWithNoHsCodes: ''
  }
}

export interface NoProductSearch {
  mode: PurchaseOrdersPageMode
  search?: string
  statusValue?: string
  page?: number
  createdByMe?: boolean
  pageSize?: number
  pageNumber?: number
  supplierId: string
}

interface ScheduleCountry {
  code2: string
  name: string
}

interface OrderValue {
  currencyId: string
  discountAmount: number
  netAmount: number
  taxAmount: number
  totalAmount: number
}
export interface ScheduleProduct {
  countryofLoadingCode: string
  createdByUser: string
  creationDateInternal: string
  lastChangeUser: string
  lastModifiedOnInternal: string
  portOfLoadingCode: string
  productId: Product
  requestedDeliveryDate: string
  scheduleLineCommittedQuantity: number
  scheduleLineOrderQuantity: number
  scheduleLineOrderWeight: number
  value: OrderValue
}

export interface PurchaseOrderSchedulesQuery {
  purchaseOrderId: string
  pageNumber: number
  pageSize: number
}

export interface ScheduleDetailsQuery {
  id: string
  includeItems?: boolean
  pageNumber?: number
  pageSize?: number
}

export interface OrderDocument extends Document {
  documentType: number
}

export enum PurchaseOrderDocumentType {
  Default = 0,
  PaymentTerms = 1,
  Media = 2,
  Custom = 3
}

export enum PurchaseOrderViewQuery {
  DEFAULT = 0,
  WIDGET = 1
}

export interface AllPurchaseOrderQuery {
  mode?: PurchaseOrdersPageMode
  search?: string
  statusValue?: string
  page?: number
  createdByMe?: boolean
  getSalesOrders?: boolean
  pageSize?: number
  pageNumber?: number
  view: PurchaseOrderViewQuery
}

interface PurchaseOrderWidgetAcceptedOrders {
  id: string
  poNumber: string
  currencyCode: string
  acceptedDate: Date
  supplierName: string
}

interface PurchaseOrderWidgetStatusCalculations {
  total: number
  percentage: number
  color: string
}

interface PurchaseOrderWidgetStatusInfo {
  rejected: PurchaseOrderWidgetStatusCalculations
  pending: PurchaseOrderWidgetStatusCalculations
  accepted: PurchaseOrderWidgetStatusCalculations
  shipping: PurchaseOrderWidgetStatusCalculations
}

export interface PurchaseOrderWidgetResponse {
  acceptedOrders: PurchaseOrderWidgetAcceptedOrders[]
  activeTotal: number
  statusInfo: PurchaseOrderWidgetStatusInfo
}
