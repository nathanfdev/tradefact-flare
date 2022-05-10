import React from 'react'
import { useTranslation } from 'react-i18next'
import OrderList from '../../components/order-list/order-list'
import { OrderStatus } from '../../packages/tradefact-objects/order'

const OrderListView = () => {
  const { t } = useTranslation()
  return (
    <OrderList
      hasFilter={false}
      hasStatusHeaders={false}
      headerText={t('generic.activeFlares')}
      defaultStatus={OrderStatus.TrackingActive}
    />
  )
}

export default OrderListView
