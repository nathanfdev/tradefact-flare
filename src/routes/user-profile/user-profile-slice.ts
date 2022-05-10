import { createSlice } from '@reduxjs/toolkit'
import { addMatchersForLoading } from '../../helpers'
import {
  ReduxLoadingState,
  REDUX_LOADING_STATUS
} from '../../helpers/constants'
import { uploadProfileImage } from '../../packages/tradefact-api/upload'

interface UserProfileState {
  uploadingProfileImage: boolean
  status: ReduxLoadingState
  subscriptionPlan: string
  picture: string | null
}

const initialState: UserProfileState = {
  uploadingProfileImage: false,
  status: REDUX_LOADING_STATUS.IDLE,
  subscriptionPlan: '',
  picture: null
}

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(uploadProfileImage.fulfilled, (state, { payload }) => {
      state.picture = payload
    })
    addMatchersForLoading(
      builder,
      'uploadProfileImage',
      'uploadingProfileImage'
    )
  }
})

export default userProfileSlice.reducer
