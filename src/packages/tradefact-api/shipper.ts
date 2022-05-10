import { fetchFromApi } from '.'
import {
  Address,
  Directory,
  MinimalQuoteRequest,
  Page,
  ShipperPartnership
} from '../tradefact-objects'
import { ForwarderClient } from '../tradefact-objects/partnership'
import { LogisticsClientRequest } from '../tradefact-objects/user'
export const getShipper = (): Promise<Directory> =>
  fetchFromApi(`/shipper/`, undefined, {
    method: 'GET'
  })

export const listShipperQuotes = async (
  search?: string,
  status?: string,
  shipmentMethod?: number,
  pageNumber?: number,
  pageSize?: number,
  activeOnly?: boolean,
  CombineRelatedQuotes?: boolean
): Promise<Page<MinimalQuoteRequest>> => {
  pageSize = pageSize ?? 10
  pageNumber = pageNumber ?? 1
  if (status) {
    if (shipmentMethod === -1) {
      return fetchFromApi(
        `/shipper/quotationrequest`,
        { search, status, pageNumber, pageSize },
        {
          method: 'GET'
        }
      )
    }
    return fetchFromApi(
      `/shipper/quotationrequest`,
      { search, status, shipmentMethod, pageNumber, pageSize },
      {
        method: 'GET'
      }
    )
  } else {
    if (shipmentMethod === -1) {
      return fetchFromApi(
        `/shipper/quotationrequest`,
        {
          search,
          status,
          pageNumber,
          pageSize,
          activeOnly,
          CombineRelatedQuotes
        },
        {
          method: 'GET'
        }
      )
    }
    return fetchFromApi(
      `/shipper/quotationrequest`,
      {
        search,
        status,
        shipmentMethod,
        pageNumber,
        pageSize,
        activeOnly
      },
      {
        method: 'GET'
      }
    )
  }
}

export const downloadQuoteOrderItems = (id: string): Promise<string> =>
  fetchFromApi(
    `/shipper/quotationrequest/${id}/csv`,
    {},
    {
      method: 'GET'
    },
    true
  )

export const updateShipper = (shipper: Directory): Promise<Directory> =>
  fetchFromApi(`/shipper/`, undefined, {
    method: 'PUT',
    body: JSON.stringify(shipper)
  })

export const getShipperInvoiceAddress = (): Promise<Address> =>
  fetchFromApi(`/shipper/address/invoice`, undefined, {
    method: 'GET'
  })

export const createShipperInvoiceAddress = (
  address: Address
): Promise<Address> => {
  return fetchFromApi(`/shipper/address/invoice`, undefined, {
    method: 'POST',
    body: JSON.stringify(address)
  })
}

export const updateShipperInvoiceAddress = (
  address: Address
): Promise<Address> => {
  return fetchFromApi(`/shipper/address/invoice`, undefined, {
    method: 'PUT',
    body: JSON.stringify(address)
  })
}

export const getShipperPartnership = (): Promise<Page<ShipperPartnership>> =>
  fetchFromApi(`/shipper/partnerships`, undefined, {
    method: 'GET'
  })

export const getShipperLogisticsClients = ({
  pageNumber,
  pageSize,
  search,
  orderByName,
  status,
  showPending = true
}: LogisticsClientRequest): Promise<Page<ForwarderClient>> =>
  fetchFromApi(
    `/shipper/logisticsclients`,
    { search, pageNumber, pageSize, orderByName, status, showPending },
    {
      method: 'GET'
    }
  )
