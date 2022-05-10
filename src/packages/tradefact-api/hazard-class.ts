import { fetchFromApi } from '.'
import { HazardClassInfo, Page } from '../tradefact-objects'

export const listHazardClasses = (): Promise<Page<HazardClassInfo>> =>
  fetchFromApi('/reference/hazardcodes')
