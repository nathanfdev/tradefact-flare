import { ProductDocumentType } from './products'

export interface Files {
  file: File
  name: string
  documentType?: ProductDocumentType
}
