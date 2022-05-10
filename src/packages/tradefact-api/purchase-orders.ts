import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchFromApi } from '.'
import {
  AdditionalCharge,
  CreateSchedule,
  Page,
  StockLevelOrder
} from '../tradefact-objects'
import {
  AcceptPurchaseOrder,
  AllPurchaseOrderQuery,
  CompletePurchaseOrder,
  CreatePurchaseOrder,
  InProductionPurchaseOrder,
  NoProductSearch,
  PatchPurchaseOrder,
  PreShipmentPurchaseOrder,
  PurchaseOrder,
  PurchaseOrderActivity,
  PurchaseOrderImport,
  PurchaseOrderItem,
  PurchaseOrderQuote,
  PurchaseOrderSchedulesQuery,
  PurchaseOrderShipments,
  PurchaseOrdersPageMode,
  PurchaseOrderViewQuery,
  PurchaseOrderWidgetResponse,
  RejectPurchaseOrder,
  ScheduleDetailsQuery,
  SchedulesOverview,
  ShippedPurchaseOrder,
  SubmitPurchaseOrder,
  SubmitPurchaseOrderCharge,
  SubmitPurchaseOrderItem,
  SubmitPurchaseOrderItemList,
  UpdatePurchaseOrder,
  UpdatePurchaseOrderItem
} from '../tradefact-objects/purchase-order'
import { PurchaseOrderStatus } from '../tradefact-objects/purchase-order-status'

export const createPurchaseOrder = (
  body: CreatePurchaseOrder
): Promise<PurchaseOrder> =>
  fetchFromApi('/purchaseorder', undefined, {
    method: 'POST',
    body: JSON.stringify(body)
  })

export const updatePurchaseOrder = (
  id: string,
  body: UpdatePurchaseOrder
): Promise<UpdatePurchaseOrder> =>
  fetchFromApi(`/purchaseorder/${id}`, undefined, {
    method: 'PUT',
    body: JSON.stringify(body)
  })

export const deletePurchaseOrder = async (id: string): Promise<void> =>
  fetchFromApi(`/purchaseorder/${id}`, undefined, {
    method: 'DELETE'
  })

export const getPurchaseOrderById = (id: string): Promise<PurchaseOrder> =>
  fetchFromApi(`/purchaseorder/${id}`, undefined, {
    method: 'GET'
  })

export const noProductSearch = ({
  mode,
  search,
  statusValue,
  page,
  createdByMe,
  pageSize,
  pageNumber,
  supplierId
}: NoProductSearch): Promise<PurchaseOrder[]> => {
  pageSize = pageSize ?? 10
  pageNumber = pageNumber ?? 1
  const hasException = mode === PurchaseOrdersPageMode.rejected
  const activeOnly = mode === PurchaseOrdersPageMode.active
  const completed = mode === PurchaseOrdersPageMode.completed
  const allNoDrafts = mode === PurchaseOrdersPageMode.allNoDrafts
  const draftOnly = mode === PurchaseOrdersPageMode.drafts

  return fetchFromApi(
    `/purchaseorder/noproductsearch`,
    {
      search,
      status: statusValue,
      pageNumber: page,
      pageSize,
      createdByMe,
      activeOnly,
      hasException,
      completed,
      allNoDrafts,
      draftOnly,
      supplierId
    },
    {
      method: 'GET'
    }
  )
}

export const getPurchaseOrders = (
  mode: PurchaseOrdersPageMode,
  search?: string,
  statusValue?: string,
  page?: number,
  createdByMe?: boolean,
  getSalesOrders?: boolean,
  pageSize?: number,
  pageNumber?: number
): Promise<PurchaseOrder[]> => {
  pageSize = pageSize ?? 10
  pageNumber = pageNumber ?? 1
  const hasException = mode === PurchaseOrdersPageMode.rejected
  const activeOnly = mode === PurchaseOrdersPageMode.active
  const completed = mode === PurchaseOrdersPageMode.completed
  const allNoDrafts = mode === PurchaseOrdersPageMode.allNoDrafts
  const draftOnly = mode === PurchaseOrdersPageMode.drafts
  const isDeleted = mode === PurchaseOrdersPageMode.deleted

  let status = statusValue

  if (hasException) {
    status = PurchaseOrderStatus.Rejected.toString()
  }

  return fetchFromApi(
    `/purchaseorder`,
    {
      search,
      status,
      pageNumber: page,
      pageSize,
      createdByMe,
      getSalesOrders,
      activeOnly,
      hasException,
      completed,
      allNoDrafts,
      draftOnly,
      isDeleted
    },
    {
      method: 'GET'
    }
  )
}

export const getAllPurchaseOrders = createAsyncThunk(
  'purchaseOrderWidget/getAllPurchaseOrders',
  async ({
    mode,
    search,
    statusValue,
    page,
    createdByMe,
    getSalesOrders,
    pageSize,
    pageNumber,
    view = PurchaseOrderViewQuery.DEFAULT
  }: AllPurchaseOrderQuery) => {
    pageSize = pageSize ?? 10
    pageNumber = pageNumber ?? 1
    const hasException = mode === PurchaseOrdersPageMode.rejected
    const activeOnly = mode === PurchaseOrdersPageMode.active
    const completed = mode === PurchaseOrdersPageMode.completed
    const allNoDrafts = mode === PurchaseOrdersPageMode.allNoDrafts
    const draftOnly = mode === PurchaseOrdersPageMode.drafts
    const isDeleted = mode === PurchaseOrdersPageMode.deleted

    const response: PurchaseOrderWidgetResponse = await fetchFromApi(
      `/purchaseorder`,
      {
        search,
        status: statusValue,
        pageNumber: page,
        pageSize,
        createdByMe,
        getSalesOrders,
        activeOnly,
        hasException,
        completed,
        allNoDrafts,
        draftOnly,
        isDeleted,
        view
      },
      {
        method: 'GET'
      }
    )

    return response
  }
)

export const patchPurchaseOrder = (
  id: string,
  body: PatchPurchaseOrder[]
): Promise<UpdatePurchaseOrder> =>
  fetchFromApi(`/purchaseorder/${id}`, undefined, {
    method: 'PATCH',
    body: JSON.stringify(body)
  })

export const submitPurchaseOrderItem = (
  id: string,
  body: SubmitPurchaseOrderItem
): Promise<SubmitPurchaseOrderItem> =>
  fetchFromApi(`/purchaseorder/${id}/items`, undefined, {
    method: 'POST',
    body: JSON.stringify(body)
  })

export const submitPurchaseOrderItemList = (
  id: string,
  body: SubmitPurchaseOrderItemList[],
  supplierId?: string,
  AllProducts?: boolean,
  linkedOnly?: boolean
): Promise<SubmitPurchaseOrderItem> =>
  fetchFromApi(
    `/purchaseorder/${id}/items/list/?supplierId=${supplierId}&AllProducts=${AllProducts}&linkedOnly=${linkedOnly}`,
    undefined,
    {
      method: 'POST',
      body: JSON.stringify(body)
    }
  )

export const getPurchaseOrderItems = (
  id: string
): Promise<PurchaseOrderItem[]> =>
  fetchFromApi(`/purchaseorder/${id}/items`, undefined, {
    method: 'GET'
  })

export const deletePurchaseOrderItem = async (
  purchaseOrderId: string,
  purchaseOrderLineId: string
): Promise<void> =>
  fetchFromApi(
    `/purchaseorder/${purchaseOrderId}/items/${purchaseOrderLineId}`,
    undefined,
    {
      method: 'DELETE'
    }
  )
export const removePurchaseOrderDocument = async (
  purchaseOrderId: string,
  productId: string,
  documentId: string
): Promise<void> =>
  fetchFromApi(
    `/purchaseorder/${purchaseOrderId}/product/${productId}/document/${documentId}`,
    undefined,
    {
      method: 'DELETE'
    }
  )

export const deleteAllPurchaseOrderItems = async (
  purchaseOrderId: string
): Promise<void> =>
  fetchFromApi(`/purchaseorder/${purchaseOrderId}/items`, undefined, {
    method: 'DELETE'
  })

export const getPurchaseOrderCharge = (
  id: string
): Promise<AdditionalCharge[]> =>
  fetchFromApi(`/purchaseorder/${id}/additionalcharges`, undefined, {
    method: 'GET'
  })

export const updatePurchaseOrderItem = (
  purchaseOrderId: string,
  purchaseOrderLineId: string,
  body: UpdatePurchaseOrderItem
): Promise<UpdatePurchaseOrderItem> =>
  fetchFromApi(
    `/purchaseorder/${purchaseOrderId}/items/${purchaseOrderLineId}`,
    undefined,
    {
      method: 'PUT',
      body: JSON.stringify(body)
    }
  )

export const submitPurchaseOrderCharge = (
  id: string,
  body: SubmitPurchaseOrderCharge
): Promise<SubmitPurchaseOrderCharge> =>
  fetchFromApi(`/purchaseorder/${id}/additionalcharges`, undefined, {
    method: 'POST',
    body: JSON.stringify(body)
  })

export const updatePurchaseOrderCharge = (
  purchaseOrderId: string,
  purchaseOrderChargeId: string,
  body: SubmitPurchaseOrderCharge
): Promise<SubmitPurchaseOrderCharge> =>
  fetchFromApi(
    `/purchaseorder/${purchaseOrderId}/additionalcharges/${purchaseOrderChargeId}`,
    undefined,
    {
      method: 'PUT',
      body: JSON.stringify(body)
    }
  )

export const deletePurchaseOrderCharge = async (
  purchaseOrderId: string,
  purchaseOrderChargeId: string
): Promise<void> =>
  fetchFromApi(
    `/purchaseorder/${purchaseOrderId}/additionalcharges/${purchaseOrderChargeId}`,
    undefined,
    {
      method: 'DELETE'
    }
  )

export const submitPurchaseOrder = (
  id: string,
  body: SubmitPurchaseOrder
): Promise<SubmitPurchaseOrder> =>
  fetchFromApi(`/purchaseorder/${id}/submit`, undefined, {
    method: 'POST',
    body: JSON.stringify(body)
  })

export const resendPurchaseOrderMail = (
  id: string,
  body: SubmitPurchaseOrder
): Promise<SubmitPurchaseOrder> =>
  fetchFromApi(`/purchaseorder/${id}/resend`, undefined, {
    method: 'POST',
    body: JSON.stringify(body)
  })

export const acceptPurchaseOrder = (
  id: string,
  body: AcceptPurchaseOrder
): Promise<AcceptPurchaseOrder> =>
  fetchFromApi(`/purchaseorder/${id}/accept`, undefined, {
    method: 'POST',
    body: JSON.stringify(body)
  })

export const inProductionPurchaseOrder = (
  id: string,
  body: InProductionPurchaseOrder
): Promise<InProductionPurchaseOrder> =>
  fetchFromApi(`/purchaseorder/${id}/inproduction`, undefined, {
    method: 'POST',
    body: JSON.stringify(body)
  })

export const preShipmentPurchaseOrder = (
  id: string,
  body: PreShipmentPurchaseOrder
): Promise<PreShipmentPurchaseOrder> =>
  fetchFromApi(`/purchaseorder/${id}/preshipment`, undefined, {
    method: 'POST',
    body: JSON.stringify(body)
  })

export const shippedPurchaseOrder = (
  id: string,
  body: ShippedPurchaseOrder
): Promise<ShippedPurchaseOrder> =>
  fetchFromApi(`/purchaseorder/${id}/shipped`, undefined, {
    method: 'POST',
    body: JSON.stringify(body)
  })

export const rejectPurchaseOrder = (
  id: string,
  body: RejectPurchaseOrder
): Promise<RejectPurchaseOrder> =>
  fetchFromApi(`/purchaseorder/${id}/reject`, undefined, {
    method: 'POST',
    body: JSON.stringify(body)
  })

export const resetToDraftOrder = (id: string): Promise<void> =>
  fetchFromApi(`/purchaseorder/${id}/draft`, undefined, {
    method: 'POST'
  })

export const resetOrderStatus = (id: string): Promise<void> =>
  fetchFromApi(`/purchaseorder/${id}/reset`, undefined, {
    method: 'POST'
  })
export const completePurchaseOrder = (
  id: string,
  body: CompletePurchaseOrder
): Promise<CompletePurchaseOrder> =>
  fetchFromApi(`/purchaseorder/${id}/complete`, undefined, {
    method: 'POST',
    body: JSON.stringify(body)
  })

export type attachedOnly = {
  attachedonly?: boolean
}

export const downloadOrderItems = (id: string): Promise<string> =>
  fetchFromApi(
    `/purchaseorder/${id}/csv`,
    {},
    {
      method: 'GET'
    },
    true
  )

export const getPurchaseOrderActivity = (
  id: string
): Promise<Page<PurchaseOrderActivity>> =>
  fetchFromApi(`/purchaseorder/${id}/timeline`, undefined, {
    method: 'GET'
  })

export const postShippingQuote = async (id: string): Promise<void> =>
  fetchFromApi(`/purchaseorder/${id}/shipping/quote`, undefined, {
    method: 'POST'
  })

export const importFromFile = (body: {
  batchId: string
  productId: string
  purchaseOrderId: string
}): Promise<PurchaseOrderImport> =>
  fetchFromApi(`/task/flatfile/purchaseorder/import`, undefined, {
    method: 'POST',
    body: JSON.stringify(body)
  })

export const getImportUpdate = (id: string): Promise<PurchaseOrderImport> =>
  fetchFromApi(`/task/${id}`, undefined, {
    method: 'GET'
  })

export const copyProductsFromOrder = (
  id: string,
  originalId: string
): Promise<any> =>
  fetchFromApi(`/purchaseorder/${id}/items/copy/${originalId}`, undefined, {
    method: 'POST'
  })

export const createStockLevelOrder = (
  body: StockLevelOrder
): Promise<string[]> =>
  fetchFromApi('/product/reorderproducts', undefined, {
    method: 'POST',
    body: JSON.stringify(body)
  })

export const createSchedule = (body: CreateSchedule): Promise<CreateSchedule> =>
  fetchFromApi('/schedules', undefined, {
    method: 'POST',
    body: JSON.stringify(body)
  })

export const getAllSchedules = (
  search: string,
  pageNumber: number,
  pageSize: number,
  countryCode?: string,
  portOfLoading?: string,
  schedules?: string
): Promise<Page<SchedulesOverview>> =>
  fetchFromApi(
    '/schedules',
    { search, pageNumber, pageSize, countryCode, portOfLoading, schedules },
    { method: 'GET' }
  )

export const getPurchaseOrderSchedules = ({
  purchaseOrderId,
  pageNumber,
  pageSize
}: PurchaseOrderSchedulesQuery): Promise<Page<SchedulesOverview>> =>
  fetchFromApi(
    `/purchaseorder/${purchaseOrderId}/schedule`,
    { pageNumber, pageSize },
    { method: 'GET' }
  )

export const getScheduleDetails = ({
  id,
  includeItems = true,
  pageNumber = 1,
  pageSize = 10
}: ScheduleDetailsQuery): Promise<SchedulesOverview> =>
  fetchFromApi(
    `/schedules/${id}`,
    { includeItems, pageNumber, pageSize },
    { method: 'GET' }
  )

export const deleteSchedule = (id: string): Promise<any> =>
  fetchFromApi(`/schedules/${id}`, undefined, { method: 'DELETE' })

export const requestUpdate = (id: string): Promise<any> =>
  fetchFromApi(`/purchaseorder/${id}/requestupdate`, undefined, {
    method: 'POST'
  })

export const getPurchaseOrderShipments = (
  id: string,
  shipmentMethod: string,
  queryString: string
): Promise<Page<PurchaseOrderShipments>> =>
  fetchFromApi(
    `/purchaseorder/${id}/shipments?shipmentMethod=${shipmentMethod}${queryString}`,
    undefined,
    {
      method: 'GET'
    }
  )

export const getPurchaseOrderQuotes = (
  id: string,
  shipmentMethod: string,
  queryString: string
): Promise<Page<PurchaseOrderQuote>> =>
  fetchFromApi(
    `/purchaseorder/${id}/quotes?shipmentMethod=${shipmentMethod}${queryString}`,
    undefined,
    {
      method: 'GET'
    }
  )
