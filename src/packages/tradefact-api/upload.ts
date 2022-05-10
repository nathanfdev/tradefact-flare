import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchFromApi } from '.'
import {
  UploadImageResponse,
  UploadResponse,
  UserInfo
} from '../tradefact-objects'

export const upload = (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file, file.name)

  return fetchFromApi('/upload', undefined, {
    method: 'POST',
    body: formData,
    redirect: 'follow'
  })
}

export const uploadImage = (file: File): Promise<UploadImageResponse> => {
  const body = new FormData()
  body.append('', file, file.name)

  return fetchFromApi('/image', undefined, {
    method: 'POST',
    body
  })
}

export const uploadProfileImage = createAsyncThunk(
  'userProfile/uploadProfileImage',
  async (file: File) => {
    const body = new FormData()
    body.append('', file, file.name)

    const response: UserInfo = await fetchFromApi(
      '/user/profileimage',
      undefined,
      {
        method: 'POST',
        body
      }
    )

    return response.picture || null
  }
)
