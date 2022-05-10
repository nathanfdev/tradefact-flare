import { fetchFromApi } from '.'
import { InviteOrganisationInfo } from '../tradefact-objects'
import { InviteCreation, OrganisationInfo } from '../tradefact-objects/user'

const reservedOrganizationNames = ['shoham']

export const checkOrganisationAvailability = async (
  name: string
): Promise<boolean> => {
  return !reservedOrganizationNames.includes(name)
}

export const inviteOrganisation = (
  organisation: InviteOrganisationInfo
): Promise<InviteCreation> => {
  return fetchFromApi(`/invitation/createinvitation`, undefined, {
    method: 'POST',
    body: JSON.stringify(organisation)
  })
}

export const sendPartnershipInvite = (body: {
  email: string
  partnershipType: number
  isProvider: boolean
}): Promise<void> =>
  fetchFromApi(`/invitation/sendpartnershipinvite`, undefined, {
    method: 'POST',
    body: JSON.stringify(body)
  })

export const acceptPartnershipInvite = (body: {
  hash: string
  partnershipType: number
  isProvider: boolean
}): Promise<void> =>
  fetchFromApi(`/invitation/partnershipaccepted`, undefined, {
    method: 'POST',
    body: JSON.stringify(body)
  })

export const fetchCompanyNameFromInvitation = (
  companyId: string
): Promise<OrganisationInfo> =>
  fetchFromApi(
    `/invitation/companynamefromhash`,
    { hash: companyId },
    {
      method: 'GET'
    }
  )
