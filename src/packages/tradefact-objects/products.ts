import { HazardContents } from '.'

export enum HazardCode {
  None = 'None',
  Hazardous = 'Hazardous'
}
export interface Product {
  id?: string
  name: string
  nickname?: string
  goodsType?: string
  packing?: string
  sku: string
  description: string
  hsCode: string
  supplier?: string
  lastModifiedOnInternal?: string
  creationDateInternal?: string
  dimensions?: {
    length?: number
    width?: number
    height?: number
    scale?: string
    weight?: number
    weightMeasurement?: string
  }
  stackable?: boolean
  rotatable?: boolean
  hazardCode?: HazardCode
  lithiumBatteryPacking: string
  magneticFieldContained: boolean
  hazardClass: string
  hazardNotes: string
  hazardAttachment: string
  unitsPerPackage: number
  hazardousContents: HazardContents
  isProductVariant?: boolean
  unitsInTransit?: number
  activeOrders?: number
  unitQty?: number
  unitPrice?: number
  poLineId?: string
  availableSuppliers?: number
  barcode: string
  identifier?: {
    asin?: string
    ean?: string
    ePID?: string
    gpc?: string
    gtin?: string
    isbn?: string
    jan?: string
    mpn?: string
    upc?: string
  }
  stockQuantity?: number
  incomingStockQuantity?: number
  minStockQuantity?: number
  suppliers?: ProductSuppliers[]
  supplierReference?: string
  thumbnailBlobUrl?: string
}

export interface ProductSupplierCurrency {
  id?: number
  currencyCode: string
  price: number
}

export interface ProductSuppliers {
  currencies?: ProductSupplierCurrency[]
  price?: number
  productId?: string
  supplierId?: string
  supplierName?: string
  supplierReference?: string
  orderQuantityMinimum?: number
}

export interface Document {
  id: string
  name: string
  description?: string
  dateUploaded: string
  blobUrl: string
  isRichText?: boolean
  owner?: boolean
  uploadedBy?: string
  isDefaultImage?: boolean
  thumbnailBlobUrl?: string
  documentType?: ProductDocumentType
  extension?: string
  richTextData?: string
}

export interface RichText {
  id: string
  name: string
  description?: string
  dateUploaded: string
  richTextData: string
}

export interface RichTextUpload {
  name: string
  content: string
  documentType?: ProductDocumentType
}

export interface FreightMovementProduct {
  id: string
  name: string
  sku: string
  description: string
  hsCode: string
  supplier: string
  dimensions: {
    length: number
    width: number
    height: number
    scale: string
    weight: number
    weightMeasurement: string
  }
  hazardCode: HazardCode
  productQty: number
  cartonQty: number
  lithiumBatteryPacking: string
  magneticFieldContained: boolean
  hazardClass: string
  hazardNotes: string
  hazardAttachment: string
  unitsPerPackage: number
  hazardousContents: HazardContents
  packing: string
  isProductVariant?: boolean
  unitPrice?: number
  unitQty?: number
  poLineId?: string
  barcode: string
  identifier?: {
    asin?: string
    ean?: string
    ePID?: string
    gpc?: string
    gtin?: string
    isbn?: string
    jan?: string
    mpn?: string
    upc?: string
  }
  stockQuantity?: number
  incomingStockQuantity?: number
  minStockQuantity?: number
  supplierReference?: string
}

export interface OrderInfo {
  orderQuantity?: number
  productId?: string
}

export interface StockLevelProductsToOrder {
  orderInfo?: OrderInfo[]
  supplierId?: string
}
export interface ProductToOrder {
  id?: string
  uniqueId?: string
  name: string
  sku: string
  minStockQuantity?: number
  stockQuantity?: number
  orderQuantity?: number
  orderQuantityMinimum?: number
  suppliers?: ProductSuppliers[]
  selectedSupplierId?: string
}
export interface StockLevelOrder {
  orderReference: string
  productsToOrder: StockLevelProductsToOrder[]
}

export interface ScheduleProduct {
  purchaseOrderItemId: string
  scheduleLineCommittedQuantity: number
}

export interface CreateSchedule {
  goodsReadyDate: string
  name: string
  placeOfLoading: string
  purchaseOrderId: string
  scheduleLines: ScheduleProduct[]
}

export const PackingType: { [key: string]: string } = {
  pallets_48x40: 'Pallets (48x40)',
  pallets_48x48: 'Pallets (48x48)',
  pallets_60x48: 'Pallets (60x48)',
  pallets_1200x800_euro: 'Pallets (1200x800) EURO',
  pallets_1200x1000_uk: 'Pallets (1200x1000) UK',
  pallets_other: 'Pallets Other',
  bags: 'Bags',
  bales: 'Bales',
  boxes_cartons: 'Boxes / Cartons',
  bundles: 'Bundles',
  carpets: 'Carpets',
  coils: 'Crates',
  cylinders: 'Cylinders',
  drums: 'Drums',
  pails: 'Pails',
  reels: 'Reels',
  rolls: 'Rolls',
  tubes_pipes: 'Tubes Pipes'
}

export const createNewProduct = () => {
  return {
    name: '',
    sku: '',
    hsCode: '',
    description: '',
    nickname: '',
    length: 0,
    width: 0,
    height: 0,
    sizeUnit: 'cm',
    weight: 0,
    weightUnit: 'kg',
    goodsType: '',
    packing: 'none',
    lithiumBatteryPacking: '',
    magneticFieldContained: false,
    hazardClass: 'none',
    hazardNotes: '',
    hazardAttachment: '',
    stackable: true,
    rotatable: true,
    unitsPerPackage: 0,
    hazardousContents: HazardContents.NONE,
    barcode: '',
    asin: '',
    ean: '',
    ePID: '',
    gpc: '',
    gtin: '',
    isbn: '',
    jan: '',
    mpn: '',
    upc: '',
    stockQuantity: 0,
    incomingStockQuantity: 0,
    minStockQuantity: 0
  }
}

export enum ProductDocumentType {
  All = 0,
  Specification = 1,
  Media = 2,
  Customs = 3
}

export interface ProductFilter {
  key: ProductSortType
  value: string
}
export enum ProductSortType {
  NAME_ASC = 'name.asc',
  NAME_DEC = 'name.desc',
  DATE_CREATED_ASC = 'datecreated.asc',
  DATE_CREATED_DESC = 'datecreated.desc',
  DATE_UPDATED_ASC = 'dateupdated.asc',
  DATE_UPDATED_DESC = 'dateupdated.desc',
  UNITS_TRANSIT_DESC = 'unitsintransit.desc',
  SUPPLIER_DESC = 'availablesuppliers.desc'
}
export const ProductFilterOptions: ProductFilter[] = [
  { key: ProductSortType.NAME_ASC, value: 'Product Name A-Z' },
  { key: ProductSortType.NAME_DEC, value: 'Product Name Z-A' },
  {
    key: ProductSortType.DATE_CREATED_ASC,
    value: 'Date Created (oldest first)'
  },
  {
    key: ProductSortType.DATE_CREATED_DESC,
    value: 'Date Created (newest first)'
  },
  {
    key: ProductSortType.DATE_UPDATED_ASC,
    value: 'Date Updated (oldest first)'
  },
  {
    key: ProductSortType.DATE_UPDATED_DESC,
    value: 'Date Updated (newest first)'
  },
  { key: ProductSortType.UNITS_TRANSIT_DESC, value: 'Units in Transit' },
  { key: ProductSortType.SUPPLIER_DESC, value: 'Suppliers' }
]

export enum ProductTab {
  PRODUCTINFO,
  INVENTORY,
  DIMENSIONS,
  SUPPLIERS,
  HAZARDS,
  SPECIFICATION,
  CUSTOMS,
  MEDIA
}

export interface MediaDeletion {
  documentId: string
  name: string
}
export interface DocumentDeletion {
  documentId: string
  name: string
}

export interface ProductSupplierBaseProps {
  defaultSupplierCurrency: string
  itemPosition: number
  onAddPrice: (
    selectedCurrency: string,
    selectedPrice: number,
    supplierId: string
  ) => void
  onRemovePrice: (selectedCurrency: string, supplierId: string) => void
}

export const hideView = [
  'doc',
  'docx',
  'xls',
  'xlsx',
  'csv',
  'ppt',
  'pptx',
  'aac',
  'mp3',
  'wav',
  'wma',
  'ac3',
  'dts',
  'mpg',
  'mpeg',
  'mp4',
  'avi',
  'mov',
  'm2ts'
]
