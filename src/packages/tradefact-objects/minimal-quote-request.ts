export interface MinimalQuoteRequest {
  client: string
  goodsReady: Date
  goodsReadyDates: Date[]
  incoterms: number
  loadType: number
  name: string
  partner: string
  placeOfDischarge: string
  placeOfLoading: string
  portOfDischarge: string
  portOfLoading: string
  id: string
  reference: string
  shipmentType: number
  state: number
  submitted: number
  isRevision: boolean
  schedules: [
    {
      goodsReady: Date
      id: string
      placeOfLoading: string
      placeOfLoadingId: string
      scheduleName: string
    }
  ]
  partners?: Partners[]
}
export interface Partners {
  name: string
  quotationId: string
  state: number
}
