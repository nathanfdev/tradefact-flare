import { createSlice } from '@reduxjs/toolkit'
import {
  getEarliestShipmentDate,
  placeOrder
} from '../packages/tradefact-api/order'
import { Address } from '../packages/tradefact-objects'
import {
  EarliestShipmentDate,
  NewOrderRequest
} from '../packages/tradefact-objects/order'
import { AddressFormUnionType } from '../routes/create-order/steps/delivery-step'
import { toast } from '../helpers'
import { t } from 'i18next'

interface ActionType<T> {
  type: string
  payload: T
}
interface LocallySavedAddresses {
  deliveryAddressId: Address
  destinationAddressId: Address
}
interface AddressFormState {
  preLoadedAddress: boolean
  toggleForm: boolean
  originOrDestination: AddressFormUnionType
  saveAddress?: boolean
}
export interface OrderCompletionState {
  SHIPMENT: boolean
  DELIVERY: boolean
  SETUP: boolean
  SUMMARY: boolean
}
export interface InitialState {
  modalOpen: boolean
  countryFilter: any
  earliestShipmentDate: EarliestShipmentDate
  newOrder: NewOrderRequest
  locallySavedAddresses: LocallySavedAddresses
  addressFormState: AddressFormState
  orderCompletionState: OrderCompletionState
}

export const initialState: InitialState = {
  modalOpen: false,
  countryFilter: '',
  earliestShipmentDate: {
    earliestDate: '',
    workingDays: 0
  },
  newOrder: {
    deliveryAddressId: '',
    destinationAddressId: '',
    lineItems: [],
    referenceNumber: '',
    referenceType: null,
    shipmentDate: '',
    shipmentName: '',
    transportMode: null
  },
  locallySavedAddresses: {
    deliveryAddressId: {},
    destinationAddressId: {}
  },
  addressFormState: {
    preLoadedAddress: false,
    toggleForm: false,
    saveAddress: false,
    originOrDestination: 'deliveryAddressId'
  },
  orderCompletionState: {
    SHIPMENT: false,
    DELIVERY: false,
    SETUP: false,
    SUMMARY: false
  }
}

const orderFormSlice = createSlice({
  name: 'orderForm',
  initialState,
  reducers: {
    toggleModal: (state, action) => {
      state.modalOpen = action.payload
    },
    saveFormState: (state, action) => {
      state.newOrder = action.payload
    },
    openAddressForm: (state, action: ActionType<AddressFormState>) => {
      state.addressFormState = action.payload
    },
    saveCountryFilter: (state, action: any) => {
      state.countryFilter = action.payload
    },
    saveState: (
      state,
      action: ActionType<{ target: keyof InitialState; value: any }>
    ) => {
      state[action.payload.target] = action.payload.value
    },
    resetSlice: () => initialState,
    resetState: (state, action: ActionType<keyof InitialState>) => {
      state[action.payload] = initialState[action.payload]
    },
    toggleState: (state, action: ActionType<keyof InitialState>) => {
      state[action.payload] = !state[action.payload]
    },
    saveAddress: (
      state,
      action: ActionType<{
        target: AddressFormUnionType
        value: Address
      }>
    ) => {
      state.locallySavedAddresses[action.payload.target] = action.payload.value
    },
    toggleStepValidity: (
      state,
      action: ActionType<{
        target: keyof OrderCompletionState
        value: boolean
      }>
    ) => {
      state.orderCompletionState[action.payload.target] = action.payload.value
    }
  },
  extraReducers: builder => {
    builder.addCase(placeOrder.fulfilled, state => {
      state.modalOpen = false
      toast(t('newOrderForm.orderSuccessful'), {
        title: t('generic.success'),
        icon: 'success'
      })
    })
    builder.addCase(placeOrder.rejected, () => {
      toast(t('validation.genericToastErrorMessage'), {
        title: t('generic.error'),
        icon: 'error'
      })
    })
    builder.addCase(getEarliestShipmentDate.fulfilled, (state, { payload }) => {
      state.earliestShipmentDate = payload
    })
    builder.addCase(getEarliestShipmentDate.rejected, state => {
      state.earliestShipmentDate = initialState.earliestShipmentDate
    })
  }
})

export const {
  toggleModal,
  saveFormState,
  openAddressForm,
  saveAddress,
  toggleStepValidity,
  saveCountryFilter,
  resetSlice,
  resetState,
  toggleState,
  saveState
} = orderFormSlice.actions

export default orderFormSlice.reducer
