import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchFromApi } from '.'
import { InviteUserInfo, Page, User, UserInfo } from '../tradefact-objects'
import { InviteCreation } from '../tradefact-objects/user'

export const getInitials = (name: string) => {
  return name
    .split(/\s/)
    .reduce((response, word) => (response += word.slice(0, 1)), '')
}

export const listUsers = (
  search?: string,
  pageNumber?: number,
  pageSize?: number
): Promise<Page<User>> =>
  fetchFromApi(
    '/users',
    { search, pageNumber, pageSize },
    {
      method: 'GET'
    }
  )

export const createUser = (user: User): Promise<User> =>
  fetchFromApi('/users/', undefined, {
    method: 'POST',
    body: JSON.stringify(user)
  })

export const readUser = (id: string): Promise<User> =>
  fetchFromApi(`/users/${id}`)

export const updateUser = (user: User): Promise<User> =>
  fetchFromApi(`/users/`, undefined, {
    method: 'PUT',
    body: JSON.stringify(user)
  })

export const getProfile = (): Promise<UserInfo> =>
  fetchFromApi('/user/getprofile', undefined, {
    method: 'GET'
  })

export const inviteUser = (user: InviteUserInfo): Promise<InviteCreation> => {
  return fetchFromApi(`/invitation/createinvitation`, undefined, {
    method: 'POST',
    body: JSON.stringify(user)
  })
}

export const resendInvite = (emailAddress: string): Promise<void> => {
  return fetchFromApi(`/invitation/resend`, undefined, {
    method: 'POST',
    body: JSON.stringify({ emailAddress })
  })
}

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response: UserInfo = await fetchFromApi('/user/getprofile', undefined, {
    method: 'GET'
  })
  return response
})

export const updateUserPreferences = createAsyncThunk(
  'user/updateUserPreferences',
  async ({ userId, body }: any) => {
    const response: UserInfo = await fetchFromApi(
      `/user/${userId}/updatePreferences`,
      undefined,
      {
        method: 'PUT',
        body: JSON.stringify(body)
      }
    )

    return response
  }
)
