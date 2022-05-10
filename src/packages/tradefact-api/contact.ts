import { fetchFromApi } from '.'
import { Contact, DirectoryType, Page } from '../tradefact-objects'

const getDirectoryTypePath = (directoryType: string) =>
  directoryType.toLowerCase() === DirectoryType.Partner ||
  directoryType.toLowerCase() === DirectoryType.Shipper
    ? `${directoryType}`
    : `network`

export const getContacts = async (
  id: string,
  directoryType: string,
  search?: string,
  locationId?: string,
  pageNumber?: number,
  pageSize?: number
): Promise<Page<Contact>> => {
  pageNumber = pageNumber ?? 1
  pageSize = pageSize ?? 10

  return fetchFromApi(
    `/${getDirectoryTypePath(directoryType)}/${id}/contact`,
    { search, locationId, pageNumber, pageSize },
    {
      method: 'GET'
    }
  )
}

export const addNewContactToDirectory = async (
  directoryId: string,
  directoryType: string,
  newContact: Contact
): Promise<Contact> =>
  fetchFromApi(
    `/${getDirectoryTypePath(directoryType)}/${directoryId}/contact`,
    undefined,
    {
      method: 'POST',
      body: JSON.stringify(newContact)
    }
  )

export const updateContact = async (
  directoryId: string,
  directoryType: string,
  contact: Contact,
  contactId: string
): Promise<Contact> =>
  fetchFromApi(
    `/${getDirectoryTypePath(
      directoryType
    )}/${directoryId}/contact/${contactId}`,
    undefined,
    {
      method: 'PUT',
      body: JSON.stringify(contact)
    }
  )

export const deleteContact = async (
  directoryId: string,
  directoryType: string,
  contactId: string
): Promise<void> =>
  fetchFromApi(
    `/${getDirectoryTypePath(
      directoryType
    )}/${directoryId}/contact/${contactId}`,
    undefined,
    {
      method: 'DELETE'
    }
  )

export const downloadCsvReport = (id: string): Promise<string> =>
  fetchFromApi(
    `/device/${id}/reports/csv`,
    {},
    {
      method: 'GET'
    },
    true
  )
