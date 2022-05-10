import {
  EarliestShipmentDate,
  FlarePriceList,
  NewOrderRequest
} from './../tradefact-objects/order'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { useCallback, useEffect, useState } from 'react'
import { fetchFromApi } from '.'
import { isEmpty } from 'lodash'
import { RootState, useAppDispatch, useAppSelector } from '../../components/app'
import { ALL_COUNTRY_FILTER } from '../../helpers/constants'
import {
  onCountryChangePreferences
  // onCountryFilterChange,
  // onLoadingUserPreferences
  // onStatusChange
} from '../../routes/dashboard/reducer/order-slice'
import { Page } from '../tradefact-objects'
import {
  AllOrder,
  AllOrderQuery,
  FiltersResponse,
  OrderStatus
} from '../tradefact-objects/order'

export const getFilters = createAsyncThunk('order/getFilters', async () => {
  const response: FiltersResponse = await fetchFromApi(
    '/order/filters',
    undefined,
    {
      method: 'GET'
    }
  )

  return response
})

export const createDeviceFilters = (t: any) => [
  { key: t('generic.all'), value: OrderStatus.None || '' },
  { key: t('generic.active'), value: OrderStatus.TrackingActive },
  { key: t('generic.awaiting'), value: OrderStatus.AwaitingFulfillment },
  { key: t('generic.completed'), value: OrderStatus.TrackingComplete }
]

export const getAllOrders = createAsyncThunk(
  'order/getAllOrders',
  async ({ search }: AllOrderQuery, thunkAPI) => {
    const { order } = thunkAPI.getState() as RootState
    !isEmpty(order.filters) && (await thunkAPI.dispatch(getFilters()))
    const response: Page<AllOrder> = await fetchFromApi(
      '/order',
      {
        search,
        status: OrderStatus.TrackingActive,
        originCountryCode:
          order.countryFilters.selectedOrigin.code === ALL_COUNTRY_FILTER
            ? ''
            : order.countryFilters.selectedOrigin.code,
        destinationCountryCode:
          order.countryFilters.selectedDestination.code === ALL_COUNTRY_FILTER
            ? ''
            : order.countryFilters.selectedDestination.code
      },
      {
        method: 'GET'
      }
    )

    await thunkAPI.dispatch(
      onCountryChangePreferences({
        allOrders: response
      })
    )

    return response
  }
)

export const getEarliestShipmentDate = createAsyncThunk(
  'order/getEarliestShipmentDate',
  async (originCountryCode: string): Promise<EarliestShipmentDate> => {
    return fetchFromApi(
      '/order/earliestshipmentdate',
      { originCountryCode },
      { method: 'GET' }
    )
  }
)

export const getListOrders = createAsyncThunk(
  'order/getAllOrders',
  async ({ pageNumber }: AllOrderQuery, thunkAPI) => {
    const { orderListView } = thunkAPI.getState() as RootState

    const response: Page<AllOrder> = await fetchFromApi(
      '/order',
      {
        pageNumber,
        pageSize: 10,
        search: orderListView.search,
        status:
          orderListView.deviceFilterStatus === OrderStatus.None
            ? ''
            : orderListView.deviceFilterStatus,
        sortBy: orderListView.sortFilterStatus || '',
        originCountryCode: '',
        destinationCountryCode: ''
      },
      {
        method: 'GET'
      }
    )
    return response
  }
)

export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (order: NewOrderRequest): Promise<AllOrder> => {
    return fetchFromApi('/order', undefined, {
      method: 'POST',
      body: JSON.stringify(order)
    })
  }
)

export const completeOrder = createAsyncThunk(
  'order/completeOrder',
  async (id: string): Promise<any> => {
    return fetchFromApi(`/order/${id}/complete`, undefined, { method: 'POST' })
  }
)

export const useOrders = () => {
  const dispatch = useAppDispatch()
  const { orders, pending } = useAppSelector(state => ({
    orders: state.order.allOrders?.items!,
    pending: state.order.loading
  }))
  const boundAction = useCallback(() => {}, [dispatch])
  useEffect(() => {
    if (!orders) boundAction()
  }, [boundAction, orders])

  return {
    orders,
    pending
  }
}

export const useApiCall = <T>(callback: any) => {
  const [response, setResponse] = useState<T | null>(null)
  const [error, setError] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      try {
        const res = await callback()
        setResponse(res)
        setIsLoading(false)
      } catch (error) {
        setError(error)
      }
    }

    fetchData()
  }, [])

  return { response, error, isLoading }
}

export const getFlarePricelist = async (): Promise<FlarePriceList[]> => {
  return await fetchFromApi(`/order/pricelist`, undefined, { method: 'GET' })
}
export const getOrderTrackingUrl = async (id: string): Promise<any> => {
  return await fetchFromApi(`/order/${id}/sharinglink`, {
    method: 'GET'
  })
}
export const getDeviceTrackingUrl = async (id: string): Promise<any> => {
  return await fetchFromApi(`/device/${id}/sharinglink`, {
    method: 'GET'
  })
}
