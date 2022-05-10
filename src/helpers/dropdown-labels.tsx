import classNames from 'classnames'
import React from 'react'
import { FormatOptionLabelMeta } from 'react-select'
import {
  Address,
  Country,
  Directory,
  Freight,
  PortInfo,
  ProductSuppliers,
  ShipmentType
} from '../packages/tradefact-objects'
import { DropdownOptionType } from '../packages/tradefact-objects/dropdown-resource'

interface SelectLabelProps<T> {
  options: DropdownOptionType<T>
  meta?: FormatOptionLabelMeta<DropdownOptionType<T>>
}

export const getNoOptionsMessage = (search: string, selectedPort?: string) => {
  if (selectedPort) {
    return null
  } else {
    if (search.length > 0) {
      return 'No Results Found'
    } else {
      return 'Please Enter Text'
    }
  }
}

export const FlareAddressSelectLabel = (
  options: DropdownOptionType<Address>
) => {
  return (
    <div className='searchable-dropdown__container'>
      <div className='searchable-dropdown__result__icon'>
        <i className='far fa-home'></i>
      </div>
      <div className='searchable-dropdown__result__inner'>
        <span className='searchable-dropdown__result__heading'>
          <span>{options.label}</span>
        </span>
      </div>
    </div>
  )
}

export const FlareCountrySelectLabel = (
  options: DropdownOptionType<Country>
) => {
  return (
    <div className='searchable-dropdown__container'>
      <div className='searchable-dropdown__result__icon'>
        <i className='far fa-map-marker-alt'></i>
      </div>
      <div className='searchable-dropdown__result__inner'>
        <span className='searchable-dropdown__result__heading'>
          <span>{options?.label && options.label.split('|')[0]}</span>
        </span>
      </div>
    </div>
  )
}

const isMenuOpen = <T extends {}>(
  meta: FormatOptionLabelMeta<
    DropdownOptionType<T>
  > = {} as FormatOptionLabelMeta<DropdownOptionType<T>>
) => meta.context === 'menu'

export const AddressSelectLabel = ({
  options,
  meta
}: SelectLabelProps<Address>) => {
  const label = options.label
  const heading = label.split('|')[0]
  const postalCode = label.split('|')[1]
  const city = label.split('|')[2]
  const country = label.split('|')[3]

  return (
    <div className='searchable-dropdown__container'>
      <div className='searchable-dropdown__result__icon'>
        <i className='far fa-home'></i>
      </div>
      <div className='searchable-dropdown__result__inner'>
        <span className='searchable-dropdown__result__heading'>
          {isMenuOpen<Address>(meta) ? (
            <>
              <span>{heading}</span>
              <span className='searchable-dropdown__result__code text-white badge badge-secondary'>
                {postalCode}
              </span>
            </>
          ) : (
            <span>{[heading, city].filter(x => x).join(', ')}</span>
          )}
        </span>
        {isMenuOpen<Address>(meta) && (
          <small className='searchable-dropdown__result__sub-heading'>
            <span>
              {city}, {country}
            </span>
          </small>
        )}
      </div>
    </div>
  )
}

export const SupplierSelectLabel = ({
  options
}: SelectLabelProps<Directory | ProductSuppliers>) => (
  <div className='searchable-dropdown__container'>
    <div className='searchable-dropdown__result__icon'>
      <i className='far fa-boxes'></i>
    </div>
    <div className='searchable-dropdown__result__inner'>
      <span className='searchable-dropdown__result__heading'>
        <span>{options.label}</span>
      </span>
    </div>
  </div>
)

interface PortSelectLabelProps extends SelectLabelProps<PortInfo> {
  shipmentMethod?: ShipmentType
}

const upperCaseFirstLetterOnly = (label: string) =>
  label
    .split(' ')
    .filter(x => x.length > 0)
    .map(x => x[0].toUpperCase() + x.slice(1).toLowerCase())
    .join(' ')

export const PortSelectLabel = ({
  options,
  shipmentMethod,
  meta
}: PortSelectLabelProps) => (
  <div className='searchable-dropdown__container'>
    <div className='searchable-dropdown__result__icon'>
      <i
        className={classNames(
          'far',
          shipmentMethod === ShipmentType.SEA ? 'fa-anchor' : 'fa-plane'
        )}
      ></i>
    </div>
    <div className='searchable-dropdown__result__inner'>
      <span className='searchable-dropdown__result__heading'>
        <span>{upperCaseFirstLetterOnly(options.label.split('|')[0])}</span>
        <span className='searchable-dropdown__result__code text-white badge badge-secondary'>
          {options.label.split('|')[1]}
        </span>
      </span>
      {isMenuOpen<PortInfo>(meta) && (
        <small className='searchable-dropdown__result__sub-heading'>
          <span>{upperCaseFirstLetterOnly(options.label.split('|')[2])}</span>
        </small>
      )}
    </div>
  </div>
)

export const FreightSelectLabel = ({ options }: SelectLabelProps<Freight>) => {
  return (
    <div className='searchable-dropdown__container'>
      <div className='searchable-dropdown__result__icon'>
        <i className={options.label.split('|')[0]}></i>
      </div>
      <div className='searchable-dropdown__result__heading'>
        <span className='text_only'>{options.label.split('|')[1]}</span>
      </div>
    </div>
  )
}

export const TextOnlyDropdownLabel = ({
  options
}: SelectLabelProps<string>) => {
  return (
    <div className='searchable-dropdown__container'>
      <div className='searchable-dropdown__result__heading'>
        <span className='text_only'>{options.label}</span>
      </div>
    </div>
  )
}

export const CurrencyDropdownLabel = ({
  options
}: SelectLabelProps<string>) => {
  let flagName = options.label.split(',')[0]
  return (
    <div className='searchable-dropdown__container'>
      <div className='searchable-dropdown__result__icon'>
        <img
          src={`/images/flags/${flagName}.png`}
          className='flag'
          alt='currency flag'
        />
      </div>
      <div className='searchable-dropdown__result__heading'>
        <span className='text_only'>{options.label.split(',')[0]}</span>
        <span className='currency-country'>{options.label.split(',')[1]}</span>
      </div>
    </div>
  )
}
