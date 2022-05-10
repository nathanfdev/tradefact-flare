import { fetchFromApi } from '.'
import { QuotationCreateRequest } from '../tradefact-objects'

export const submitQuotation = (body: QuotationCreateRequest): Promise<void> =>
  fetchFromApi('/partner/quotation', undefined, {
    method: 'POST',
    body: JSON.stringify(body)
  })
