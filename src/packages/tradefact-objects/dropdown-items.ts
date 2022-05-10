import { Freight } from './all'
import { ShipmentType } from './shipment-type-enum'
import { ShipmentsMobileView, ShipmentStatus } from './shipment'
import { QuoteStatus } from './quote-status'
import { ActivityEntityType } from './activity'
import { OrganisationStatus } from './user'
import { DropdownOptionType } from './dropdown-resource'

export const freightOptions: Array<Freight> = [
  {
    value: -1,
    label: 'All Modes',
    icon: 'far fa-container-storage'
  },
  { value: ShipmentType.AIR, label: 'Air', icon: 'fas fa-plane' },
  { value: ShipmentType.SEA, label: 'Sea', icon: 'fas fa-ship' },
  { value: ShipmentType.ROAD, label: 'Road', icon: 'fas fa-truck' }
]

export const shipmentDropDownStatus: Array<DropdownOptionType<string>> = [
  { label: 'All', value: '' },
  {
    label: 'Awaiting Collection',
    value: ShipmentStatus['Awaiting Collection'].toString()
  },
  {
    label: 'In Transit To Port',
    value: ShipmentStatus['In Transit To Port'].toString()
  },
  { label: 'Shipping', value: ShipmentStatus.Shipping.toString() },
  {
    label: 'Pending Customs Clearance',
    value: ShipmentStatus['Pending Customs Clearance'].toString()
  },
  {
    label: 'In Transit To Destination',
    value: ShipmentStatus['In Transit To Destination'].toString()
  }
]

export const quotesStatusDropDown: Array<DropdownOptionType<string>> = [
  { label: 'All', value: '' },
  { label: 'Pending', value: QuoteStatus.Pending.toString() },
  { label: 'Ready', value: QuoteStatus.Ready.toString() }
]

export const organisationStatusDropDown: Array<DropdownOptionType<string>> = [
  { label: 'All', value: '' },
  { label: 'Pending', value: OrganisationStatus.Pending.toString() },
  { label: 'Active', value: OrganisationStatus.Active.toString() }
]

export const shipmentOnMobileViewDropDown: Array<DropdownOptionType<string>> = [
  {
    label: 'Progress',
    value: ShipmentsMobileView['Progress'].toString()
  },
  {
    label: 'Quote',
    value: ShipmentsMobileView['Quote'].toString()
  },
  {
    label: 'Documents',
    value: ShipmentsMobileView['Documents'].toString()
  },
  {
    label: 'Cargo',
    value: ShipmentsMobileView['Cargo'].toString()
  },
  {
    label: 'Comments',
    value: ShipmentsMobileView['Comments'].toString()
  }
]
export const activityWidgetDropDown = [
  {
    label: 'Orders',
    value: ActivityEntityType.PURCHASEORDER.toString(),
    select: true
  },
  {
    label: 'Shipments',
    value: ActivityEntityType.SHIPMENT.toString(),
    select: true
  },
  {
    label: 'Products',
    value: ActivityEntityType.PRODUCT.toString(),
    select: true
  },
  {
    label: 'Network',
    value: ActivityEntityType.NETWORK.toString(),
    select: true
  }
]

export interface OrderSortFilter {
  key: OrderSortType
  value: string
}

export enum OrderSortType {
  SHIPMENT_DATE_CREATED_DESC = 'shipmentdate.desc',
  SHIPMENT_DATE_CREATED_ASC = 'shipmentdate.asc',
  LAST_UPDATED_DESC = 'lastupdated.desc',
  LAST_UPDATED_ASC = 'lastupdated.asc',
  ORDER_DATE_DESC = 'orderdate.desc',
  ORDER_DATE_ASC = 'orderdate.asc'
}

export const OrderFilterOptions: OrderSortFilter[] = [
  {
    key: OrderSortType.ORDER_DATE_DESC,
    value: 'Order Date (newest first)'
  },
  {
    key: OrderSortType.ORDER_DATE_ASC,
    value: 'Order Date (oldest first)'
  },
  {
    key: OrderSortType.SHIPMENT_DATE_CREATED_DESC,
    value: 'Shipment Date (newest first)'
  },
  {
    key: OrderSortType.SHIPMENT_DATE_CREATED_ASC,
    value: 'Shipment Date (oldest first)'
  },
  {
    key: OrderSortType.LAST_UPDATED_DESC,
    value: 'Last Updated (newest first)'
  },
  {
    key: OrderSortType.LAST_UPDATED_ASC,
    value: 'Last Updated (oldest first)'
  }
]
