import { Page } from '../tradefact-objects/all'
import { fetchFromApi } from '.'
import { Address, Directory, DirectoryType } from '../tradefact-objects'
import { createOptions } from '../../helpers/dropdown-options'
import { NewAddressRequest } from '../tradefact-objects/address-resource'

const isDirectoryNotShipperAndPartner = (directoryType: string) =>
  directoryType.toLowerCase() !== DirectoryType.Partner &&
  directoryType.toLowerCase() !== DirectoryType.Shipper

export const listDirectoryAddresses = async (
  id: string,
  directoryType: string,
  search?: string,
  pageNumber?: number,
  pageSize?: number
): Promise<Page<Address>> => {
  pageSize = pageSize ?? 10
  pageNumber = pageNumber ?? 1
  if (isDirectoryNotShipperAndPartner(directoryType)) {
    return fetchFromApi(
      `/network/${id}/address`,
      { search, pageNumber, pageSize },
      { method: 'GET' }
    )
  }
  return fetchFromApi(
    `/${directoryType}/address`,
    { search, pageNumber, pageSize },
    { method: 'GET' }
  )
}

export const listCompanyAddressesNoPaging = async (
  search?: string
): Promise<Page<Address>> => {
  return fetchFromApi(
    `/company/address`,
    { search, noPage: true },
    { method: 'GET' }
  )
}

export const listCompanyAddressesNoId = async (
  search?: string,
  pageNumber?: number,
  pageSize?: number
): Promise<Page<Address>> => {
  pageSize = pageSize ?? 10
  pageNumber = pageNumber ?? 1
  return fetchFromApi(
    `/company/address`,
    { search, pageNumber, pageSize },
    { method: 'GET' }
  )
}

export const listAddressesNoIdNoPaging = async (
  directoryType: string,
  search?: string
): Promise<Page<Address>> => {
  if (
    directoryType.toLowerCase() === DirectoryType.Partner ||
    directoryType.toLowerCase() === DirectoryType.Shipper
  ) {
    return fetchFromApi(
      `/${directoryType}/address`,
      { search, noPage: true },
      { method: 'GET' }
    )
  }

  return fetchFromApi(
    `/network/address`,
    { search, noPage: true },
    { method: 'GET' }
  )
}

export const deleteAddress = async (addressId: string): Promise<void> => {
  return fetchFromApi(`/company/address/${addressId}`, undefined, {
    method: 'DELETE'
  })
}

export const updateAddress = async (
  addressId: string,
  address: Address
): Promise<Address> => {
  return fetchFromApi(`/company/address/${addressId}`, undefined, {
    method: 'PUT',
    body: JSON.stringify(address)
  })
}

export const getAddress = async (
  directoryId: string,
  directoryType: string,
  addressId: string
): Promise<Address> => {
  if (isDirectoryNotShipperAndPartner(directoryType)) {
    return fetchFromApi(
      `/network/${directoryId}/address/${addressId}`,
      undefined,
      {
        method: 'GET'
      }
    )
  }
  return fetchFromApi(`/${directoryType}/address/${addressId}`, undefined, {
    method: 'GET'
  })
}

export const addNewAddressToCompany = (
  newAddress: Address
): Promise<Directory> => {
  return fetchFromApi(`/company/address`, undefined, {
    method: 'POST',
    body: JSON.stringify(newAddress)
  })
}

// FLARE API CALLS
// SavedAddress cross-references Address on the server
export const getAddressById = async (id: string): Promise<Address> => {
  return fetchFromApi(`/company/address/${id}`, undefined, { method: 'GET' })
}

export const getSavedAddresses = async (
  search?: string,
  countryCode?: string
): Promise<Page<Address>> => {
  return await fetchFromApi(
    `/company/address/saved`,
    { search, noPage: true, countryCode },
    {
      method: 'GET'
    }
  )
}

export async function getFormattedSavedAddresses(
  inputValue: string,
  countryCode: string,
  filterId = ''
) {
  return await getSavedAddresses(inputValue, countryCode)
    .then(({ items }) => {
      items = items.filter((x: Address) => x.id !== filterId)
      return createOptions<Address>({
        type: 'savedAddress',
        objectArray: items
      })
    })
    .catch(e => {
      console.error(e)
    })
}

export const updateSavedAddress = async (
  id: string,
  updatedAddress: Address
) => {
  return fetchFromApi(`/company/address/${id}`, undefined, {
    method: 'PUT',
    body: JSON.stringify(updatedAddress)
  })
}

export const createAddress = async (newAddress: NewAddressRequest) => {
  return fetchFromApi('/company/address', undefined, {
    method: 'POST',
    body: JSON.stringify(newAddress)
  })
}
