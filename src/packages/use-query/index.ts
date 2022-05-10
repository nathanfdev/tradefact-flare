import { useHistory, useLocation } from 'react-router-dom'

const parseQueryString = (qs: string): object =>
  qs.split('&').reduce((current, part) => {
    const [key, value] = part.split('=')
    return {
      ...current,
      [key]: value
    }
  }, {})

const buildQueryString = (obj: any): string => {
  const result = Object.keys(obj)
    .filter(x => !!x && !!obj[x])
    .map(key => `${key}=${obj[key]}`)
    .join('&')

  return result.length > 0 ? `?${result}` : ''
}

export interface UseQueryResult {
  [name: string]: string | undefined
}

export const useQuery = (): [UseQueryResult, (obj: object) => void] => {
  const history = useHistory()
  const { pathname, hash, search = '' } = useLocation()
  const [, ...rest] = search
  const qs = rest.join('')

  const update = (obj: object) => {
    const updatedSearch = buildQueryString({
      ...parseQueryString(qs),
      ...obj
    })

    history.push({
      pathname,
      hash,
      search: updatedSearch
    })
  }

  return [parseQueryString(qs) as UseQueryResult, update]
}
