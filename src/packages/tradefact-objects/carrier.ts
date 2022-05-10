import { ShipmentType } from './shipment-type-enum'

export interface Carrier2 {
  active: boolean
  carrierGroup: string
  description: string
  name: string
  scac: string
  shipmentType: {
    id: string
    name: string
  }
  shipmentTypeId: ShipmentType
}
