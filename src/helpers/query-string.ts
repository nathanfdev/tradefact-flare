export const createQueryString = (stringArray: string[], query: string) => {
  // Tradefact API sometimes can take a "array[string]" as a parameter,
  // this function constructs the parameter by concatenating strings in an array
  // such as '&schedules=id1&schedules=id2'
  let queryString: string = ''
  let queryKey: string = '&' + query + '='
  stringArray.map(item => (queryString += queryKey + item))
  return queryString
}

export const parameterizeArray = (key: string, arr: string[]) => {
  let stringArray = arr.map(encodeURIComponent)
  return stringArray.join('&' + key + '=')
}
