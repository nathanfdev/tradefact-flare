import { fetchFromApi } from '.'
import {
  Address,
  Client,
  Directory,
  MinimalQuoteRequest,
  Page
} from '../tradefact-objects'
import { LogisticsClientRequest } from '../tradefact-objects/user'

export const getCompany = (): Promise<Directory> =>
  fetchFromApi(`/company`, undefined, {
    method: 'GET'
  })
export const updateCompany = (company: Directory): Promise<Directory> =>
  fetchFromApi(`/company`, undefined, {
    method: 'PUT',
    body: JSON.stringify(company)
  })

export const getCompanyInvoiceAddress = (): Promise<Address> =>
  fetchFromApi(`/company/address/invoice`, undefined, {
    method: 'GET'
  })
export const createCompanyInvoiceAddress = (
  address: Address
): Promise<Address> => {
  return fetchFromApi(`/company/address/invoice`, undefined, {
    method: 'POST',
    body: JSON.stringify(address)
  })
}

export const updateCompanyInvoiceAddress = (
  address: Address
): Promise<Address> => {
  return fetchFromApi(`/company/address/invoice`, undefined, {
    method: 'PUT',
    body: JSON.stringify(address)
  })
}
export const updatePartner = (partner: Directory): Promise<Directory> =>
  fetchFromApi(`/partner/`, undefined, {
    method: 'PUT',
    body: JSON.stringify(partner)
  })

export const getPartnerInvoiceAddress = (): Promise<Address> =>
  fetchFromApi(`/partner/address/invoice`, undefined, {
    method: 'GET'
  })

export const createPartnerInvoiceAddress = (
  address: Address
): Promise<Address> => {
  return fetchFromApi(`/partner/address/invoice`, undefined, {
    method: 'POST',
    body: JSON.stringify(address)
  })
}

export const updatePartnerInvoiceAddress = (
  address: Address
): Promise<Address> => {
  return fetchFromApi(`/partner/address/invoice`, undefined, {
    method: 'PUT',
    body: JSON.stringify(address)
  })
}

export const listQuotes = async (
  search?: string,
  status?: string,
  shipmentMethod?: number,
  pageNumber?: number,
  pageSize?: number,
  activeOnly?: boolean
): Promise<Page<MinimalQuoteRequest>> => {
  pageSize = pageSize ?? 10
  pageNumber = pageNumber ?? 1
  if (status) {
    if (shipmentMethod === -1) {
      return fetchFromApi(
        `/partner/quotationrequest`,
        { search, status, pageNumber, pageSize },
        {
          method: 'GET'
        }
      )
    }
    return fetchFromApi(
      `/partner/quotationrequest`,
      { search, status, shipmentMethod, pageNumber, pageSize },
      {
        method: 'GET'
      }
    )
  } else {
    if (shipmentMethod === -1) {
      return fetchFromApi(
        `/partner/quotationrequest`,
        { search, status, pageNumber, pageSize, activeOnly },
        {
          method: 'GET'
        }
      )
    }
    return fetchFromApi(
      `/partner/quotationrequest`,
      { search, status, shipmentMethod, pageNumber, pageSize, activeOnly },
      {
        method: 'GET'
      }
    )
  }
}

export const getForwarderCustomers = ({
  pageNumber,
  pageSize,
  search,
  orderByName,
  status
}: LogisticsClientRequest): Promise<Page<Client>> => {
  return fetchFromApi(
    `/partner/logisticsclients`,
    { search, pageNumber, pageSize, orderByName, status },
    { method: 'GET' }
  )
}
