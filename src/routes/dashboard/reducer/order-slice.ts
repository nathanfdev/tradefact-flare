import { createSlice } from '@reduxjs/toolkit'
import { find, flatten, get, isEmpty } from 'lodash'
import { ALL_COUNTRY_FILTER } from '../../../helpers/constants'
import { getAllOrders, getFilters } from '../../../packages/tradefact-api/order'
import { Page } from '../../../packages/tradefact-objects'
import {
  AllOrder,
  CountryFilters,
  Device,
  FilteredOrder,
  FiltersResponse,
  OrderStatus
} from '../../../packages/tradefact-objects/order'

interface InitialState {
  allOrders: Page<AllOrder> | null
  coordinateList: Device[]
  loading: boolean
  filteredList: FilteredOrder[]
  orderStatus: OrderStatus | ''
  search: string
  filters: FiltersResponse
  countryFilters: CountryFilters
}

const initialState: InitialState = {
  allOrders: null,
  coordinateList: [],
  loading: false,
  filteredList: [],
  orderStatus: '',
  search: '',
  filters: {
    originCountries: [],
    destinationCountries: []
  },
  countryFilters: {
    originCountries: [],
    destinationCountries: [],
    selectedOrigin: { code: ALL_COUNTRY_FILTER, name: ALL_COUNTRY_FILTER },
    selectedDestination: { code: ALL_COUNTRY_FILTER, name: ALL_COUNTRY_FILTER }
  }
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    toggleDevice: (state, action) => {
      const id = action.payload
      const coord = state.coordinateList.find(d => d.deviceId === id)
      if (coord) {
        coord.isSelected = !coord.isSelected
      }
      const device = state.filteredList
        .find(order => order.id === coord?.orderId)
        ?.deviceList.find(d => d.deviceId === id)
      if (device) device.isSelected = !device.isSelected
    },

    toggleOrder: (state, action) => {
      const id = action.payload
      const order = state.filteredList.find(o => o.id === id)

      if (order) {
        const isSelecting = !order.isSelected
        const coords = state.coordinateList.filter(c => c.orderId === id)
        coords.forEach(c => {
          c.isSelected = isSelecting
        })
        order.isSelected = isSelecting
        order.deviceList.forEach(d => {
          d.isSelected = isSelecting
        })
      }
      return state
    },

    onStatusChange: (state, action) => {
      const isActiveChecked = action.payload.isActiveChecked
      const isPendingChecked = action.payload.isPendingChecked

      const bothChecked = isActiveChecked && isPendingChecked
      const bothUnchecked = !isActiveChecked && !isPendingChecked

      if (bothUnchecked) {
        state.orderStatus = OrderStatus.None
        state.filteredList = initialState.filteredList
        state.coordinateList = initialState.coordinateList
        return
      }

      if (bothChecked) {
        state.orderStatus = ''
        return
      }

      if (isActiveChecked) {
        state.orderStatus = OrderStatus.TrackingActive
        return
      }

      if (isPendingChecked) {
        state.orderStatus = OrderStatus.AwaitingFulfillment
        return
      }
    },
    onCountryFilterChange: (state, action) => {
      const countryFilters = action.payload.countryFilters

      state.countryFilters = {
        ...state.filters,
        selectedOrigin: isEmpty(countryFilters.selectedOrigin)
          ? { code: ALL_COUNTRY_FILTER, name: ALL_COUNTRY_FILTER }
          : countryFilters.selectedOrigin,
        selectedDestination: isEmpty(countryFilters.selectedDestination)
          ? { code: ALL_COUNTRY_FILTER, name: ALL_COUNTRY_FILTER }
          : countryFilters.selectedDestination
      }
    },
    onSearchChange: (state, action) => {
      state.search = action.payload.search
    },
    onCountryChangePreferences: (state, action) => {
      const filteredList: FilteredOrder[] = action.payload.allOrders.items.map(
        (item: AllOrder) => {
          const referenceNumber = get(item, 'referenceNumber', '')
          const countryOfDelivery = get(
            item,
            'deliveryAddress.country.name',
            ''
          )
          const countryOfDestination = get(
            item,
            'destinationAddress.country.name',
            ''
          )
          const latitude = get(item, 'deliveryAddress.position.latitude', '')
          const longitude = get(item, 'deliveryAddress.position.longitude', '')
          const orderId = get(item, 'id', '')
          const status = get(item, 'orderStatus', '')
          // const orderPreferences = item.id
          const deviceList = item.lineItems.map(li => {
            // const devicePreferences = li.id

            return {
              shipmentName: item.shipmentName || 'Unnamed Shipment',
              orderId,
              deviceId: get(li, 'device.deviceId', ''),
              lat: get(li, 'device.lastDeviceReport.gpsLatitude', ''),
              lng: get(li, 'device.lastDeviceReport.gpsLongitude', ''),
              lastUpdated: get(li, 'device.lastDeviceReport.gpsTime', ''),
              battery: get(li, 'device.lastDeviceReport.battery', ''),
              temperature: get(li, 'device.lastDeviceReport.temperature', ''),
              humidity: get(li, 'device.lastDeviceReport.humidity', ''),
              deviceLabel: get(li, 'labelText', ''),
              referenceNumber,
              countryOfDelivery,
              countryOfDestination,
              isSelected: true,
              status,
              deliveryLat: latitude,
              deliveryLong: longitude
            }
          })
          return {
            id: item.id,
            reference: item.shipmentName,
            isSelected: true,
            deviceList,
            status
          }
        }
      )

      state.filteredList = filteredList
      state.coordinateList = flatten(filteredList.map(x => x.deviceList))
    },
    onLoadingUserPreferences: (state, action) => {
      if (state.orderStatus === OrderStatus.None) {
        state.filteredList = initialState.filteredList
        state.coordinateList = initialState.coordinateList
        return
      }

      const userPreferenceData = action.payload.userPreferenceData

      const filteredList: FilteredOrder[] = action.payload.allOrders.items.map(
        (item: AllOrder) => {
          const referenceNumber = get(item, 'referenceNumber', '')
          const countryOfDelivery = get(
            item,
            'deliveryAddress.country.name',
            ''
          )
          const countryOfDestination = get(
            item,
            'destinationAddress.country.name',
            ''
          )
          const latitude = get(item, 'deliveryAddress.position.latitude', '')
          const longitude = get(item, 'deliveryAddress.position.longitude', '')
          const orderId = get(item, 'id', '')
          const status = get(item, 'orderStatus', '')
          const orderPreferences = find(userPreferenceData, {
            id: item.id
          })
          const deviceList = item.lineItems.map(li => {
            const devicePreferences = find(userPreferenceData, {
              id: li.id
            })
            return {
              shipmentName: item.shipmentName || 'Unnamed Shipment',
              orderId,
              deviceId: get(li, 'device.deviceId', ''),
              lat: get(li, 'device.lastDeviceReport.gpsLatitude', ''),
              lng: get(li, 'device.lastDeviceReport.gpsLongitude', ''),
              lastUpdated: get(li, 'device.lastDeviceReport.gpsTime', ''),
              battery: get(li, 'device.lastDeviceReport.battery', ''),
              temperature: get(li, 'device.lastDeviceReport.temperature', ''),
              humidity: get(li, 'device.lastDeviceReport.humidity', ''),
              deviceLabel: get(li, 'labelText', ''),
              referenceNumber,
              countryOfDelivery,
              countryOfDestination,
              isSelected: devicePreferences
                ? devicePreferences.isSelected
                : true,
              status,
              deliveryLat: latitude,
              deliveryLong: longitude
            }
          })
          return {
            id: item.id,
            reference: item.shipmentName,
            isSelected: orderPreferences ? orderPreferences.isSelected : true,
            deviceList,
            status
          }
        }
      )

      state.filteredList = filteredList
      state.coordinateList = flatten(filteredList.map(x => x.deviceList))
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getAllOrders.pending, state => {
        state.allOrders = initialState.allOrders
        state.filteredList = initialState.filteredList
        state.coordinateList = initialState.coordinateList
        state.loading = true
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload
        state.loading = initialState.loading
      })
      .addCase(getAllOrders.rejected, state => {
        state.allOrders = initialState.allOrders
        state.filteredList = initialState.filteredList
        state.coordinateList = initialState.coordinateList
        state.loading = initialState.loading
      })
      .addCase(getFilters.pending, state => {
        state.filters = initialState.filters
      })
      .addCase(getFilters.rejected, state => {
        state.filters = initialState.filters
      })
      .addCase(getFilters.fulfilled, (state, { payload }) => {
        state.filters = payload
      })
  }
})

export const {
  toggleOrder,
  toggleDevice,
  onStatusChange,
  onSearchChange,
  onLoadingUserPreferences,
  onCountryFilterChange,
  onCountryChangePreferences
} = orderSlice.actions

export default orderSlice.reducer
