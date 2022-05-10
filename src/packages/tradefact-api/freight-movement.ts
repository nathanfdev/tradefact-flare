import { fetchFromApi } from '.'
import { ContainerType, ShipmentType } from '../tradefact-objects'
import { FreightMovement } from '../tradefact-objects/freight-movement'

export const getFreightMovement = async (
  id: string
): Promise<FreightMovement> => fetchFromApi(`/freightmovement/${id}`)

export const postFreightMovement = async (
  newFreightMovement: FreightMovement
): Promise<FreightMovement> =>
  fetchFromApi('/freightmovement/create', undefined, {
    method: 'POST',
    body: JSON.stringify(newFreightMovement)
  })

export const listContainerTypes = async (
  shipmentMethod?: ShipmentType
): Promise<ContainerType[]> =>
  shipmentMethod
    ? fetchFromApi(
        `/containertype/list/?containerType=${ShipmentType[shipmentMethod]}`,
        undefined,
        {
          method: 'GET'
        }
      )
    : fetchFromApi('/containertype/list', undefined, {
        method: 'GET'
      })
