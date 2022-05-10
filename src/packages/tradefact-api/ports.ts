import { fetchFromApi } from '.'
import { PortInfo, ShipmentType } from '../tradefact-objects'

export const listPorts = async (
  type: ShipmentType,
  search?: string
): Promise<PortInfo[]> =>
  fetchFromApi(
    '/ports/list',
    { type: ShipmentType[type], search },
    {
      method: 'GET'
    }
  )
