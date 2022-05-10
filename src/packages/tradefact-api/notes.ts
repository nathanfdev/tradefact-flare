import { fetchFromApi } from '.'
import { Notes } from '../tradefact-objects'

export const getNotes = async (directoryId: string): Promise<Notes> =>
  fetchFromApi(`/network/${directoryId}/notes/`, { method: 'GET' })

export const updateNotes = async (
  directoryId: string,
  notes: Notes
): Promise<Notes> =>
  fetchFromApi(`/network/${directoryId}/notes/`, undefined, {
    method: 'PUT',
    body: JSON.stringify(notes)
  })
