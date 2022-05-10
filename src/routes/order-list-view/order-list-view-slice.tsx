import { createSlice } from '@reduxjs/toolkit'
import { getAllOrders } from '../../packages/tradefact-api/order'
import { OrderSortType } from '../../packages/tradefact-objects/dropdown-items'
import { OrderStatus } from '../../packages/tradefact-objects/order'

const initialState: any = {
  deviceFilterStatus: OrderStatus.None,
  sortFilterStatus: OrderSortType.SHIPMENT_DATE_CREATED_DESC,
  search: ''
}

const orderListViewSlice = createSlice({
  name: 'orderListView',
  initialState,
  reducers: {
    saveDeviceFilter: (state, payload) => {
      state.deviceFilterStatus = payload.payload
    },
    saveSortByFilter: (state, payload) => {
      state.sortFilterStatus = payload.payload
    },
    onSearchChange: (state, action) => {
      state.search = action.payload.search
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getAllOrders.pending, state => {
        state.allOrders = initialState.allOrders
        state.loading = true
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload
        state.loading = initialState.loading
      })
      .addCase(getAllOrders.rejected, state => {
        state.allOrders = initialState.allOrders
        state.loading = initialState.loading
      })
  }
})

export const {
  saveDeviceFilter,
  saveSortByFilter,
  onSearchChange
} = orderListViewSlice.actions

export default orderListViewSlice.reducer
