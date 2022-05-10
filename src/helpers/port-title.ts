import { ShipmentType } from '../packages/tradefact-objects'

export const getPortTitle = (shipmentMethod: ShipmentType) =>
  shipmentMethod === ShipmentType.SEA ? 'Port' : 'Airport'
