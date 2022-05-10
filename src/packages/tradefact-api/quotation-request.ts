import { fetchFromApi } from '.'
import { CargoItem, Page, QuotationRequest } from '../tradefact-objects'

export const getQuotationRequest = async (
  id: string,
  userType: string
): Promise<QuotationRequest> =>
  fetchFromApi(`/${userType}/QuotationRequest/${id}`)

export const getQuotationRequestItemsById = async (
  id: string,
  userType: string
): Promise<QuotationRequest> =>
  fetchFromApi(`/${userType}/QuotationRequestItems/${id}`)

export const getQuotationRequestCargoItems = async (
  id: string,  
  userType: string,
  freightMovementItemId?:string,
  pageNumber?: number,
  pageSize?: number
): Promise<Page<CargoItem[]>> =>
  fetchFromApi(`/${userType}/QuotationRequestCargoItems`, {
    id,
    pageNumber,
    pageSize,
    freightMovementItemId
  })
