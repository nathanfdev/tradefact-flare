export interface UserInfoAddress {
  country: string
  formatted: string
  locality: string
  postal_code: string
  region: string
  street_address: string
}

export interface UserInfo {
  id: string
  address: UserInfoAddress
  birthdate: string
  email: string
  email_verified: boolean
  fullname: string
  family_name: string
  gender: string
  givenName: string
  locale: string
  middle_name: string
  name: string
  nickname: string
  phone_number: string
  phone_number_verified: string
  picture?: string
  preferred_username: string
  profile: string
  sub: string
  updated_at: string
  website: string
  zoneinfo: string
  role: string[]
  organisation: string
  organisationtype: 'SHIPPER' | 'SUPPLIER' | 'BUYER' | 'PARTNER'
  organisationId: string
  status: string
  registrationDate: string
  hasCoreOrgData: boolean
  userPreferences: any
  tempratureUnit: string
}

export enum OrganisationType {
  'SHIPPER',
  'SUPPLIER',
  'BUYER',
  'PARTNER'
}

export enum InviteType {
  NewForwarder = 1, //Not used in the app but for manual invite requests from Tradefact
  NewShipper = 2,
  AdditionalUser = 3,
  ShipperWithNoPartnership = 4, //Not used in the app but for manual invite requests from Tradefact
  ShipperInvitesForwarder = 5,
  NewBuyer = 6,
  NewSupplier = 7
}

export enum PartnershipType {
  LOGISTICS = 1,
  SUPPLY = 2
}

export interface InviteUserInfo {
  companyName?: string
  givenName?: string
  emailAddress: string
  inviteType: InviteType
}

export enum OrganisationStatus {
  Pending = 0,
  Active = 1
}

export enum OrganisationSource {
  Directory = 1,
  Tradefact = 2,
  Invited = 3
}

export enum NetworkType {
  Self = 0,
  Managed = 1,
  Connected = 2
}

export interface InviteCreation {
  emailAlreadyExisting: boolean
  organisationName: string
  status?: number
}

export interface OrganisationInfo {
  organisationName: string
}

export enum ConnectionStatus {
  Pending = 0,
  Active = 1
}

export interface LogisticsClientRequest {
  pageNumber: number
  pageSize: number
  search: string
  orderByName: boolean
  status?: string
  showPending?: boolean
}

export interface WidgetConfiguration {
  key: string
  width: number
  xPos?: number
  yPos?: number
}
