import { isEmpty } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../components/app'
import { OrderMapSidebar } from '../../components/order-map-sidebar'
import { getAllOrders } from '../../packages/tradefact-api/order'
import { MapWidget } from '../dashboard/components/map-widget'

const OrderMapView = () => {
  const dispatch = useAppDispatch()

  const { hoverID } = useAppSelector(state => state.orderMapView)
  const { search } = useAppSelector(state => state.order)
  const { userInfo } = useAppSelector(state => state.user)

  const [provider, setProvider] = useState<any>()

  useEffect(() => {
    if (!isEmpty(userInfo?.userPreferences)) {
      dispatch(getAllOrders({ search, userInfo }))
    }
  }, [search, userInfo])

  const handleSetProvider = (provider: any) => {
    setProvider(provider)
  }

  return (
    <div className='p-0 w-100 order-map-wrapper'>
      <OrderMapSidebar provider={provider} />
      <div className='w-100 d-flex map-container'>
        <MapWidget hoverID={hoverID} handleSetProvider={handleSetProvider} />
      </div>
    </div>
  )
}

export default OrderMapView
