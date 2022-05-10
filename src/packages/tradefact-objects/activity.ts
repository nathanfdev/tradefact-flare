export enum ActivityType {
  INFO = 1,
  STATUS = 2,
  COMMENTS = 3,
  UPLOAD = 4,
  INVITE = 5
}

export enum ActivityEntityType {
  PURCHASEORDER = 1,
  SHIPMENT = 2,
  PRODUCT = 3,
  NETWORK = 4,
  QUOTES = 5,
  SETTINGS = 6
}

export interface ActivityWidgetInterface {
  creationDateInternal: string
  description: string
  entity: number
  text1: string
  text2: string
  type: number
}

export enum ActivityTypeIconMapping {
  '',
  'fa-edit',
  'fa-sync',
  'fa-comment-alt-lines',
  'fa-file-upload',
  'fa-envelope'
}
