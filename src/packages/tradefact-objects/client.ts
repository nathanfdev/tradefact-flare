export interface Client {
  activeShipments: number
  confirmedUsers: number
  invitedUsers: number
  lastFreightMovementEntered: Date
  lastShipmentBooked: Date
  name: string
  inviteId?: string
  contactEmail: string
  organisationId: string
}
