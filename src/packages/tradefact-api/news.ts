import { fetchFromApi } from '.'
import { NewsContent } from '../tradefact-objects'

export const getNewsUpdates = (): Promise<NewsContent[]> =>
  fetchFromApi('/news/list', undefined, { method: 'GET' })
