import { fetchFromApi } from '.'
import { Page, ActivityWidgetInterface } from '../tradefact-objects'

export const getActivityList = (
  pageNumber: number,
  pageSize: number,
  entities: string
): Promise<Page<ActivityWidgetInterface>> =>
  fetchFromApi(
    `/activity`,
    { pageNumber, pageSize, entities },
    { method: 'GET' }
  )
