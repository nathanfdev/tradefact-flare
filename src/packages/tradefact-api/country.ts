import { toast } from '../../helpers'
import { fetchFromApi } from '.'
import { createOptions } from '../../helpers/dropdown-options'
import { Country } from '../tradefact-objects'

export const listCountries = async (search: string): Promise<Country[]> =>
  fetchFromApi(`/country/list`, { search }, { method: 'GET' })

// API call to retrieve country list
// this needs to be debounced and wrapped in a useCallback on the component
export async function getListCountries(inputValue: string) {
  return await listCountries(inputValue)
    .then(res => {
      return createOptions<Country>({
        type: 'country',
        objectArray: res
      })
    })
    .catch(() =>
      toast('Something went wrong', {
        title: 'Error',
        icon: 'danger'
      })
    )
}
