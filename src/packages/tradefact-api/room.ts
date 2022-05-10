import { fetchFromApi } from '.'
import { Message, Room } from '../tradefact-objects'
import { ActivityEntityType } from '../tradefact-objects/activity'

export const listRoomMessages = (id: string): Promise<Room> =>
  fetchFromApi(`/chat/room/${id}`)

export const deleteRoomMessage = (id: string): Promise<void> =>
  fetchFromApi(`/chat/room/${id}`, undefined, {
    method: 'DELETE'
  })

export const addRoomMessage = (
  id: string,
  comment: string,
  entity: ActivityEntityType
): Promise<Room> =>
  fetchFromApi(`/chat/room/${id}/message`, undefined, {
    method: 'POST',
    body: JSON.stringify({
      comment,
      entity
    })
  })

export const updateRoomMessage = (
  id: string,
  comment: string
): Promise<Message> =>
  fetchFromApi(`/chat/room/${id}/message`, undefined, {
    method: 'PUT',
    body: JSON.stringify({
      comment
    })
  })
