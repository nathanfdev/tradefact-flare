import { InviteType } from './user'

export interface ShipperPartnership {
  client: {
    contactEmail: string
    contactName: string
    contactTelephone: string
    invoiceAddress: {
      addressLine1: string
      addressLine2: string
      addressLine3: string
      addressLine4: string
      city: string
      country: {
        code: string
        name: string
      }
      county: string
      id: string
      isDefault: true
      name: string
      postalCode: string
      province: string
    }
    name: string
    paymentTerms: number
    taxId: string
    tCs: string
  }
  partnershipId: string
  provider: {
    contactEmail: string
    contactName: string
    contactTelephone: string
    invoiceAddress: {
      addressLine1: string
      addressLine2: string
      addressLine3: string
      addressLine4: string
      city: string
      country: {
        code: string
        name: string
      }
      county: string
      id: string
      isDefault: true
      name: string
      postalCode: string
      province: string
    }
    name: string
    paymentTerms: number
    taxId: string
    tCs: string
  }
}

export interface ForwarderPartnership {
  client: {
    contactEmail: string
    contactName: string
    contactTelephone: string
    invoiceAddress: {
      addressLine1: string
      addressLine2: string
      addressLine3: string
      addressLine4: string
      city: string
      country: {
        code: string
        name: string
      }
      county: string
      id: string
      isDefault: true
      name: string
      postalCode: string
      province: string
    }
    name: string
    paymentTerms: number
    taxId: string
    tCs: string
  }
  partnershipId: string
  provider: {
    contactEmail: string
    contactName: string
    contactTelephone: string
    invoiceAddress: {
      addressLine1: string
      addressLine2: string
      addressLine3: string
      addressLine4: string
      city: string
      country: {
        code: string
        name: string
      }
      county: string
      id: string
      isDefault: true
      name: string
      postalCode: string
      province: string
    }
    name: string
    paymentTerms: number
    taxId: string
    tCs: string
  }
}

export interface InviteOrganisationInfo {
  companyName: string
  givenName: string
  emailAddress: string
  inviteType: InviteType
}

export interface ForwarderClient {
  activeShipments: number
  confirmedUsers: number
  invitedUsers: number
  lastFreightMovementEntered: Date
  lastShipmentBooked: Date
  creationDateInternal: Date
  name: string
  partnershipId: string
  checked?: boolean
  inviteId?: string
  contactEmail: string
  organisationId: string
}
