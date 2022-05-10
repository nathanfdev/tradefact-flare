import { ValueType } from 'react-select'
import {
  Address,
  Country,
  Directory,
  Freight,
  PortInfo,
  ProductSuppliers,
  SchedulesOverview,
  ShipmentType,
  NewsContent
} from '../packages/tradefact-objects'
import { DropdownOptionType } from '../packages/tradefact-objects/dropdown-resource'

export interface Options {
  type: string
  objectArray: any
}

interface AddressSelectValue extends Address {
  search: string
}

export const formatAddressLabel = ({
  contactName,
  postalCode,
  city,
  country
}: Address) =>
  `${contactName}|${postalCode?.toUpperCase()}|${city}|${country?.name}`

const formatPortLabel = ({ name, code, country }: PortInfo) =>
  `${name}|${code}|${country}`

export const getPortSelectValue = (
  search: string,
  portName: string,
  portCode: string
): ValueType<DropdownOptionType<PortInfo>> | null => {
  return search
    ? ({
        label: formatPortLabel({
          name: portName.split('-')[1] || search,
          code: portCode,
          country: ''
        }),
        value: {}
      } as ValueType<DropdownOptionType<PortInfo>>)
    : null
}

export const getAddressSelectValue = ({
  search,
  contactName,
  postalCode,
  city,
  country
}: AddressSelectValue): DropdownOptionType<Address> | null => {
  return search
    ? {
        label: [name, postalCode].every(x => x)
          ? formatAddressLabel({ contactName, postalCode, city, country })
          : search,
        value: {}
      }
    : null
}

export const dropdownSelectedValue = ({
  label
}: DropdownOptionType<string>): ValueType<
  DropdownOptionType<string>
> | null => {
  return {
    label: label,
    value: {}
  } as ValueType<DropdownOptionType<string>>
}

export const SelectedValue = (
  label: string
): ValueType<DropdownOptionType<string>> | null => {
  return {
    label: label,
    value: {}
  } as ValueType<DropdownOptionType<string>>
}

export const getFreightSelectValue = (
  shipmentMethod: ShipmentType
): ValueType<DropdownOptionType<Freight>> | null => {
  let icon
  switch (shipmentMethod) {
    case ShipmentType.AIR:
      icon = 'fas fa-plane'
      break
    case ShipmentType.SEA:
      icon = 'fas fa-ship'
      break
    case ShipmentType.ROAD:
      icon = 'fas fa-truck'
      break
    default:
      icon = 'far fa-container-storage'
      break
  }

  const text = !Object.values(ShipmentType).includes(shipmentMethod)
    ? 'All'
    : ShipmentType[shipmentMethod].charAt(0) +
      ShipmentType[shipmentMethod].slice(1).toLowerCase()
  return {
    label: `${icon}|${text}`,
    value: {}
  } as ValueType<DropdownOptionType<Freight>>
}

export function createOptions<T>({
  type,
  objectArray
}: Options): DropdownOptionType<T>[] {
  // Function creates array of objects with comma separated string (label)
  // and the object itself (value) for dropdown menu, depending on 'type'
  const options: any = []
  switch (type) {
    case 'address':
      return objectArray.map((item: Address) => ({
        label: formatAddressLabel(item),
        value: item
      }))
    case 'supplierName':
      return objectArray.map((supplier: Directory) => ({
        label: supplier.name,
        value: supplier
      }))
    case 'stockLevelSupplierName':
      return objectArray.map((supplier: ProductSuppliers) => ({
        label: supplier.supplierName,
        value: supplier.supplierId
      }))
    case 'port':
      return objectArray.map((port: PortInfo) => ({
        label: formatPortLabel({
          name: port.name,
          code: port.code,
          country: port.country
        }),
        value: port
      }))
    case 'country':
      return objectArray.map((country: Country) => ({
        label: `${country.name}|${country.code}`,
        value: country
      }))
    case 'freight':
      return objectArray.map((freight: Freight) => ({
        label: `${freight.icon}|${freight.label}`,
        value: freight
      }))
    case 'schedule':
      return objectArray.map((schedule: SchedulesOverview) => ({
        label: schedule.name,
        value: schedule
      }))
    case 'newWidget':
      return objectArray.map((news: NewsContent) => ({
        label: news.title,
        value: news
      }))
    case 'savedAddress':
      return objectArray.map((address: Address) => ({
        label: address.savedAsName,
        value: address
      }))
    default:
      return options
  }
}
