import { configureStore } from '@reduxjs/toolkit'
import { orderReducer } from '../../routes/dashboard/reducer'
import { userProfileReducer } from '../../routes/user-profile'
import { userReducer } from '../user-info-provider'
import { orderFormReducer, orderMapViewReducer } from '../../reducers'
import orderListViewReducer from '../../routes/order-list-view/order-list-view-slice'
import { rtkQueryErrorLogger } from './middleware'

export const store = configureStore({
  reducer: {
    user: userReducer,
    userProfile: userProfileReducer,
    orderForm: orderFormReducer,
    orderListView: orderListViewReducer,
    orderMapView: orderMapViewReducer,
    order: orderReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(rtkQueryErrorLogger),
  devTools: process.env.ENVIRONMENT !== 'PRODUCTION'
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
