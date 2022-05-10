import React from 'react'
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'
import {
  ProductFilter,
  ProductSortType
} from '../../packages/tradefact-objects'

interface SortByFilterProps {
  selectedProductFilterkey: string
  options: ProductFilter[]
  onSelected: (selectedProductFilterkey: ProductSortType) => void
}
const SortByfilter = ({
  selectedProductFilterkey,
  options,
  onSelected
}: SortByFilterProps) => {
  return (
    <UncontrolledDropdown>
      <DropdownToggle color='primary' outline caret>
        <span>Sort</span>{' '}
      </DropdownToggle>
      <DropdownMenu right>
        <span className='sort-by-heading'>Sort By: </span>
        {options.map(item => (
          <DropdownItem
            className='dropdownItem'
            key={item.key}
            onClick={() => {
              onSelected(item.key)
            }}
          >
            <div className='form-check'>
              <input
                className='form-check-input'
                type='radio'
                name='productSorting'
                value={item.key}
                checked={item.key === selectedProductFilterkey}
              />
              <label className='form-check-label' htmlFor='name.asc'>
                {item.value}
              </label>
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}
export default SortByfilter
