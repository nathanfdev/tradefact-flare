import { debounce } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import { SEARCH_DEBOUNCE_TIMEOUT } from '../helpers/constants'
import { isTabletOrMobile } from '../helpers/tablet-or-mobile'
import { useQuery } from '../packages/use-query'

interface SearchInputProps {
  placeholder: string
  onSearchChange: (search: string) => void
  formClassName?: string
}

export const SearchInput = ({
  placeholder,
  onSearchChange
}: // formClassName = 'form-inline'
SearchInputProps) => {
  const [{ search: searchFromQuery = '' }] = useQuery()
  const [search, setSearch] = useState(searchFromQuery)

  const debouncedSearch = useCallback(
    debounce(onSearchChange, SEARCH_DEBOUNCE_TIMEOUT),
    []
  )
  useEffect(() => {
    setSearch(searchFromQuery)
  }, [searchFromQuery])

  const handleChange = (value: string) => {
    setSearch(value)

    if (value.length >= 3 || value.length === 0) {
      debouncedSearch(value)
    }
  }

  return (
    <form
      className={`d-flex justify-content-between w-100 pr-2 btn-search-input`}
      onSubmit={e => e.preventDefault()}
    >
      <div className='d-flex'>
        <input
          data-testid='search-input p-0'
          type='search'
          className='form-control'
          value={search.replace(/%20/g, ' ')}
          onChange={e => handleChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>

      {!isTabletOrMobile() && (
        <div>
          <button className='btn btn-search p-0'>
            <i className='fal fa-search'></i>
          </button>
        </div>
      )}
    </form>
  )
}

export default SearchInput
