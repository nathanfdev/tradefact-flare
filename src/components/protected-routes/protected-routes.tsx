import React from 'react'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'
import {
  CreateOrder,
  Help,
  OrderListView,
  OrderMapView,
  OrganisationAdmin,
  UserProfile
} from '../../routes'
import OrderHistoryView from '../../routes/order-history'
import { useUserInfo } from '../user-info-provider'

const ProtectedRoutes = () => {
  const info = useUserInfo()
  const location = useLocation()
  const background = location.state && (location.state as any).background

  if (info === null) {
    return null
  }

  return (
    <>
      <Switch location={background || location}>
        <Route path='/user-profile' component={UserProfile} exact />
        <Route path='/admin' component={OrganisationAdmin} exact />
        <Route path='/list-view' component={OrderListView} exact />
        <Route path='/order-history' component={OrderHistoryView} exact />
        <Route path='/' component={OrderMapView} exact />
        <Redirect to='/' />
      </Switch>
      {background && (
        <Switch>
          <Route path='/create-order' children={<CreateOrder />} />
          <Route path='/help' children={<Help />} />
        </Switch>
      )}
    </>
  )
}

export default ProtectedRoutes
