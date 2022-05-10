import { createSlice } from '@reduxjs/toolkit'
import { Device } from '../packages/tradefact-objects/order'
import { ActionType } from './types'

interface InitialState {
  selectedDevice: Device | null
  hoverID: string
  marker: any
}

const initialState: InitialState = {
  selectedDevice: null,
  hoverID: '',
  marker: null
}

const orderMapViewSlice = createSlice({
  name: 'orderMapView',
  initialState,
  reducers: {
    saveMapState: (
      state,
      action: ActionType<{ target: keyof InitialState; value: any }>
    ) => {
      state[action.payload.target] = action.payload.value
    }
  }
})

export const { saveMapState } = orderMapViewSlice.actions

export default orderMapViewSlice.reducer
