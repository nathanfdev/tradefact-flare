export enum NetworkType {
  SHIPPER = 1,
  PARTNER = 4
}

export interface Network {
  name: string
  creationDateInternal: string
  organisationType: string
  status: string
}
export interface NetworkCount {
  pendingTotal: number
  connectedTotal: number
}
