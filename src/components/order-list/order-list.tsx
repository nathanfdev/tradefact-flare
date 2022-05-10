import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { Alert, Spinner } from 'reactstrap'
import {
  createDeviceFilters,
  getListOrders
} from '../../packages/tradefact-api/order'
import { AllOrder, OrderStatus } from '../../packages/tradefact-objects/order'
import { useQuery } from '../../packages/use-query'
import { useAppDispatch, useAppSelector } from '../app'
import { OrderListItem } from './order-list-item'
import OrderListTopbar from './order-list-topbar'
import { get, flatMap } from 'lodash'
import { OrderSortType } from '../../packages/tradefact-objects/dropdown-items'
import {
  onSearchChange,
  saveDeviceFilter,
  saveSortByFilter
} from '../../routes/order-list-view/order-list-view-slice'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Page } from '../../packages/tradefact-objects'

interface OrderListProps {
  headerText: string
  hasFilter: boolean
  hasStatusHeaders: boolean
  defaultStatus?: OrderStatus | ''
}

export default function OrderList({
  headerText,
  hasFilter = false,
  hasStatusHeaders = false,
  defaultStatus = OrderStatus.TrackingActive
}: OrderListProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const { allOrders } = useAppSelector(state => state.order)
  const [loadedOrders, setLoadedOrders] = useState<Page<AllOrder>[]>([])

  const isMobile = useMediaQuery({ query: '(max-width: 991px)' })
  const DeviceFilterStatus = createDeviceFilters(t)
  const { userInfo } = useAppSelector(state => state.user)
  const [expandedItem, setExpandedItem] = useState<string>('')
  const userPreferences = get(userInfo, 'userPreferences', {})
  const [flag, setFlag] = useState(false)
  const { sortFilterStatus, search } = useAppSelector(
    state => state.orderListView
  )

  const location = useLocation().search

  const [
    { orderStatus: orderStatus = OrderStatus.None.toString() },
    updateQueryString
  ] = useQuery()

  const reloadList = () => {
    setLoadedOrders([])
    dispatch(getListOrders({ userInfo }))
  }

  // When either arriving from outside the view, or changing the device filter params
  const locationChangeHandler = () => {
    const query = new URLSearchParams(location)
    const paramField = query.get('orderStatus')
    const paramDeviceId = query.get('search')

    if (paramField) {
      dispatch(saveDeviceFilter(paramField === '3' ? '' : paramField))
    } else {
      dispatch(saveDeviceFilter(defaultStatus))
    }
    dispatch(saveSortByFilter(OrderSortType.SHIPMENT_DATE_CREATED_DESC))
    if (paramDeviceId) {
      dispatch(onSearchChange({ search: paramDeviceId }))
      !flag && setFlag(true)
    }
    reloadList()
  }

  const handleExpandItem = (e: React.MouseEvent) => {
    if (flag) {
      setFlag(false)
    } else {
      const id = e.currentTarget.id
      if (id && id == expandedItem) setExpandedItem('')
      else setExpandedItem(id)
    }
  }

  const updateOrderStatus = (status: string) => {
    updateQueryString({ orderStatus: status })
  }

  const getFilterValue = (): string => {
    const index = DeviceFilterStatus.findIndex(
      (x: any) => x.value == orderStatus
    )
    return t(`${DeviceFilterStatus[index].key}`)
  }

  // Merge the recently arrived order page with existing loaded orders
  const combineOrders = (payload: any) => {
    if (loadedOrders.length === 0) setLoadedOrders([payload])
    else {
      const incomingPage = payload.paging.page
      const lastPage = loadedOrders[loadedOrders.length - 1].paging.page
      if (lastPage !== incomingPage) {
        setLoadedOrders([...loadedOrders, payload])
      }
    }
  }

  // Clear searchbar when arriving from another view
  useEffect(() => {
    dispatch(onSearchChange({ search: '' }))
  }, [])

  // Reload the list using filter from url params (location)
  useEffect(() => {
    locationChangeHandler()
  }, [location])

  // Reload list on search & sort
  useEffect(() => {
    reloadList()
  }, [sortFilterStatus, search])

  // Whenever allOrders updates, append to local order list
  useEffect(() => {
    if (loadedOrders.length === 0) {
      dispatch(getListOrders({ userInfo })).then(res => {
        if (res.payload) {
          setLoadedOrders([res.payload as Page<AllOrder>])
        }
      })
    } else if (allOrders) {
      combineOrders(allOrders)
    }
  }, [allOrders])

  const fetchOrders = () => {
    if (allOrders) {
      if (allOrders.paging.hasNext) {
        dispatch(
          getListOrders({ userInfo, pageNumber: allOrders.paging.page + 1 })
        )
      }
    }
  }

  // Determine whether there are more pages left to fetch
  const keepFetching =
    allOrders && loadedOrders.length < allOrders?.paging.totalPages
      ? true
      : false

  // If the allOrders variable returns a count of 0, we can assume there will be
  // no further order pages pending and can render the alert notice
  const emptyQuery = allOrders && allOrders.paging.totalCount === 0

  return (
    <div className={`order-list ${isMobile ? '' : 'px-5'}`}>
      <OrderListTopbar
        updateOrderStatus={updateOrderStatus}
        DeviceFilterStatus={DeviceFilterStatus}
        getFilterValue={getFilterValue}
        sortFilterStatus={sortFilterStatus}
        headerText={headerText}
        hasFilter={hasFilter}
      />
      <div id='order-list-scroll-container'>
        <InfiniteScroll
          dataLength={loadedOrders.length - 1}
          next={fetchOrders}
          hasMore={keepFetching}
          scrollableTarget={'order-list-scroll-container'}
          loader={
            <div className='text-center py-4'>
              <Spinner color='primary' />
            </div>
          }
        >
          {loadedOrders && loadedOrders.length > 0 && !emptyQuery
            ? flatMap(loadedOrders, page => page.items).map(
                (order: AllOrder, i: number) => (
                  <div
                    data-index={i}
                    data-status={order.orderStatus}
                    key={i}
                    // fantastic hack to get around z-index stacking obscuring the action dropdown
                    style={{ zIndex: 900 - i, position: 'relative' }}
                  >
                    <OrderListItem
                      expanded={
                        order.id == expandedItem ||
                        (flag === true &&
                          flatMap(loadedOrders, page => page.items).length ===
                            1)
                      }
                      handleExpansion={handleExpandItem}
                      order={order}
                      userPreferences={userPreferences}
                      showHeaders={hasStatusHeaders}
                    />
                  </div>
                )
              )
            : emptyQuery && (
                <Alert color='primary'>
                  {t(`list.blankOrderListMessage`, {
                    status: getFilterValue() == 'All' ? '' : getFilterValue()
                  })}
                </Alert>
              )}
        </InfiniteScroll>
      </div>
    </div>
  )
}
