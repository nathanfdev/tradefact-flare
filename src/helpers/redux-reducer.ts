import { ActionReducerMapBuilder, AnyAction } from '@reduxjs/toolkit'
import { REDUX_ACTION_STATE, REDUX_LOADING_STATUS } from './constants'

const { LOADING, SUCCEEDED, FAILED } = REDUX_LOADING_STATUS
const { PENDING, FULFILLED, REJECTED } = REDUX_ACTION_STATE

export const addMatchersForLoading = (
  builder: ActionReducerMapBuilder<any>,
  endpointKey: string,
  loadingKey: string
) => {
  const isMatchingEndpoint = (action: AnyAction) =>
    action.type.includes(endpointKey)

  builder
    .addMatcher(
      action => action.type.endsWith(PENDING) && isMatchingEndpoint(action),
      state => {
        state.status = LOADING
        state[loadingKey] = true
      }
    )
    .addMatcher(
      action => action.type.endsWith(FULFILLED) && isMatchingEndpoint(action),
      state => {
        state.status = SUCCEEDED
        state[loadingKey] = false
      }
    )
    .addMatcher(
      action => action.type.endsWith(REJECTED) && isMatchingEndpoint(action),
      state => {
        state.status = FAILED
        state[loadingKey] = false
      }
    )
}
