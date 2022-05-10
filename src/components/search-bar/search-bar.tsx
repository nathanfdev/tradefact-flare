import React, { useState } from 'react'
import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'

interface SearchBarProps {
  placeholder?: string
  searchFunction: (search: string) => void
}

const SearchBar = ({ placeholder, searchFunction }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  return (
    <form
      role='search-form'
      onSubmit={e => {
        e.preventDefault()
        searchFunction(searchTerm)
      }}
    >
      <InputGroup>
        <Input
          data-testid='searchbar'
          className='border-right-0 border'
          placeholder={
            placeholder && placeholder.length
              ? placeholder
              : 'Search for Shipment Name or Order Number (e.g. AECXS6764)'
          }
          value={searchTerm.replace(/%20/g, ' ')}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <InputGroupAddon addonType='prepend'>
          <InputGroupText className='border-left-0 border bg-transparent'>
            <i className='fas fa-search'></i>
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}

export default SearchBar
