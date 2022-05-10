import { createSlice } from '@reduxjs/toolkit'
import { toast as toastFucntion } from '../../helpers'
import { getUser, updateUserPreferences } from '../../packages/tradefact-api'
import { UserInfo } from '../../packages/tradefact-objects/user'
import { toast } from 'react-toastify'
interface UserProfileState {
  userInfo: UserInfo | null
}

const initialState: UserProfileState = {
  userInfo: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getUser.fulfilled, (state, { payload }) => {
        state.userInfo = payload
      })
      .addCase(updateUserPreferences.fulfilled, (state, { payload }) => {
        state.userInfo = payload
        toast.dismiss()
        toastFucntion('User preferences have been updated.', {
          title: 'Updated',
          icon: 'success'
        })
      })
  }
})

export default userSlice.reducer
