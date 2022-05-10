import { fetchFromApi } from '.'
import { Page, RouteSchedule, ShipmentType } from '../tradefact-objects'

export const listRouteSchedules = (
  type: ShipmentType,
  portOfLoading: string,
  portOfDischarge: string,
  carrier: string,
  earliestDate: string
): Promise<Page<RouteSchedule>> =>
  fetchFromApi(`/routeschedules/${ShipmentType[type].toLowerCase()}`, {
    portOfLoading,
    portOfDischarge,
    carrier,
    earliestDate
  })
