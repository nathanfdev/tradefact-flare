import { fetchFromApi } from '.'
import { Directory, MinimalShipment, Page } from '../tradefact-objects'

export const listCompanies = async (
  search?: string,
  pageNumber?: number,
  pageSize?: number
): Promise<Page<Directory>> => {
  pageSize = pageSize ?? 10
  pageNumber = pageNumber ?? 1
  return fetchFromApi(
    '/network',
    { search, pageNumber, pageSize, includeOrders: true },
    {
      method: 'GET'
    }
  )
}

export const listCompaniesNoPaging = async (
  search?: string
): Promise<Page<Directory>> => {
  return fetchFromApi(
    '/network',
    { search, noPage: true },
    {
      method: 'GET'
    }
  )
}

export const getCompany = (id: string): Promise<Directory> =>
  fetchFromApi(`/network/${id}`, undefined, {
    method: 'GET'
  })

export const createCompany = (name: string): Promise<Directory> =>
  fetchFromApi('/network/', undefined, {
    method: 'POST',
    body: JSON.stringify({ name: name })
  })

export const updateCompany = (
  network: Directory,
  id: string
): Promise<Directory> =>
  fetchFromApi(`/network/${id}`, undefined, {
    method: 'PUT',
    body: JSON.stringify(network)
  })

export const listCompanyShipments = async (
  organisationId: string,
  search?: string,
  pageNumber?: number,
  pageSize?: number
): Promise<Page<MinimalShipment>> => {
  pageSize = pageSize ?? 10
  pageNumber = pageNumber ?? 1
  return fetchFromApi(
    `/shipper/shipments`,
    {
      search,
      pageNumber,
      pageSize,
      activeOnly: true,
      hasException: false,
      completed: false,
      organisationId
    },
    {
      method: 'GET'
    }
  )
}

export const listOfCompanysAndLogistics = () => {
  return fetchFromApi(`/shipper/network`, { method: 'GET' })
}
