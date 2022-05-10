import { FreightMovement } from '.'
import { Directory } from './directory-resource'
import { QuotationResource } from './quotation'

export interface QuotationRequest {
  client: Directory
  freightMovement: FreightMovement
  quotation?: QuotationResource
  id: string
  state: number
}
