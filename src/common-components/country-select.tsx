import { debounce } from 'lodash'
import React, { CSSProperties, useCallback } from 'react'
import {
  ActionMeta,
  FormatOptionLabelMeta,
  Styles,
  ValueType
} from 'react-select'
import AsyncSelect from 'react-select/async'
import { getListCountries } from '../packages/tradefact-api'
import { Country } from '../packages/tradefact-objects'
import { DropdownOptionType } from '../packages/tradefact-objects/dropdown-resource'
import { dropdownStyles } from '../styles/dropdown-styles'
interface CountryPickerProps {
  id: string
  onChange?:
    | ((
        value: ValueType<DropdownOptionType<Country>>,
        action: ActionMeta<DropdownOptionType<Country>>
      ) => void)
    | undefined
  styles?: Partial<Styles> | undefined
}

export function CountryPicker({ id, onChange, styles }: CountryPickerProps) {
  const countryDropdownStyles = {
    ...dropdownStyles,
    control: (provided: CSSProperties) => ({
      ...dropdownStyles.control(provided)
    }),
    menu: (provided: CSSProperties) => ({
      ...dropdownStyles.menu(provided),
      width: '300px'
    }),
    menuList: (provided: CSSProperties) => ({
      ...dropdownStyles.menuList(provided)
    })
  }
  const debouncedLoadOptions = useCallback(
    debounce(getListCountries, 300, {
      leading: true
    }),
    []
  )
  return (
    <AsyncSelect
      id={id}
      name={id}
      placeholder={'Select a country...'}
      isSearchable
      styles={{
        ...countryDropdownStyles,
        ...styles
      }}
      isClearable
      defaultOptions={true}
      loadOptions={debouncedLoadOptions}
      onChange={onChange}
      formatOptionLabel={(
        options: DropdownOptionType<Country>,
        meta: FormatOptionLabelMeta<DropdownOptionType<Country>>
      ) => (
        <div className='searchable-dropdown__container'>
          <div className='searchable-dropdown__result__icon'>
            <i className='far fa-map-marker-alt'></i>
          </div>
          <div className='searchable-dropdown__result__inner'>
            <span className='searchable-dropdown__result__heading'>
              <span>{options.label.split('|')[0]}</span>
              {meta.context === 'menu' && (
                <span className='searchable-dropdown__result__code text-white badge badge-secondary'>
                  {options.label.split('|')[1]}
                </span>
              )}
            </span>
          </div>
        </div>
      )}
    />
  )
}
