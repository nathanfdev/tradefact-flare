import { WayPoint } from '.'
import { Leg } from './quotation'

export interface RouteSchedule {
  routeID?: number
  pointPairID?: number
  carrierCode?: string
  carrierName: string
  defaultCutoff?: Date
  portOfLoading?: WayPoint
  portOfDischarge?: WayPoint
  isDirect?: boolean
  transitTimeDays?: number
  transitTimeHours?: number
  transitTimeMinutes?: number
  legs?: Leg[]
  transportSummary?: string
  etd?: Date
  eta?: Date
  cutOff?: Date
  changes?: string
}
