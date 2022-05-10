import { fetchFromApi } from '.'
import { Carrier2 } from '../tradefact-objects'

export const listCarriers = (): Promise<Carrier2[]> =>
  fetchFromApi('/carriers/list')
