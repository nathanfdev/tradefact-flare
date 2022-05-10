import React from 'react'
import { useTranslation } from 'react-i18next'
import OrderList from '../../components/order-list/order-list'

const OrderHistoryView = () => {
  const { t } = useTranslation()
  return (
    <OrderList
      hasFilter
      hasStatusHeaders
      headerText={t('list.orderHistory')}
      defaultStatus={''}
    />
  )
}

export default OrderHistoryView
