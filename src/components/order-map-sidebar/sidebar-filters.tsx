import React from 'react'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap'
import SearchInput from '../../common-components/search-input'
import { ALL_COUNTRY_FILTER } from '../../helpers/constants'
import { onSearchChange } from '../../routes/order-list-view/order-list-view-slice'
import { useAppDispatch, useAppSelector } from '../app'
import CountryDropdownItem from './country-dropdown-item'

export default function SidebarFilters() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { countryFilters, filters } = useAppSelector(state => state.order)

  return (
    <div className='pb-0 px-3 pt-3'>
      <div className='mb-3'>
        <div className='table_search'>
          <SearchInput
            placeholder={t('map.searchDevices')}
            onSearchChange={(search: string) =>
              dispatch(onSearchChange({ search }))
            }
          />
        </div>
      </div>
      <div className='mb-3'>
        <UncontrolledDropdown>
          <DropdownToggle
            className='core-dropdown-toggle rounded-container'
            outline
          >
            <div className='d-flex align-items-center justify-content-between'>
              <div>
                {countryFilters.selectedOrigin.name === 'All'
                  ? t('map.filterByOrigin')
                  : countryFilters.selectedOrigin.name}
              </div>
              <div>
                <i className='fal fa-chevron-down ml-3' />
              </div>
            </div>
          </DropdownToggle>
          <DropdownMenu right>
            <CountryDropdownItem
              item={{ code: ALL_COUNTRY_FILTER, name: ALL_COUNTRY_FILTER }}
              filterKey='selectedOrigin'
              checkboxId={`delivery-checkbox-all`}
            />
            {get(filters, 'originCountries', []).map(
              (item: any, index: number) => (
                <CountryDropdownItem
                  key={`delivery-country-dropdown-item-${item.code}-${index}`}
                  item={item}
                  filterKey='selectedOrigin'
                  checkboxId={`delivery-checkbox-${item.code}`}
                />
              )
            )}
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
      <div className='mb-3'>
        <UncontrolledDropdown>
          <DropdownToggle
            className='core-dropdown-toggle rounded-container w-100'
            outline
          >
            <div className='d-flex align-items-center justify-content-between'>
              <div>
                <p>
                  {countryFilters.selectedDestination.name === 'All'
                    ? t('map.filterByDest')
                    : countryFilters.selectedDestination.name}
                </p>
              </div>
              <div>
                <i className='fal fa-chevron-down ml-3' />
              </div>
            </div>
          </DropdownToggle>
          <DropdownMenu right>
            <CountryDropdownItem
              item={{ code: ALL_COUNTRY_FILTER, name: ALL_COUNTRY_FILTER }}
              filterKey='selectedDestination'
              checkboxId={`destination-checkbox-all`}
            />
            {get(filters, 'destinationCountries', []).map(
              (item: any, index: number) => (
                <CountryDropdownItem
                  key={`destination-country-dropdown-item-${item.code}-${index}`}
                  item={item}
                  filterKey='selectedDestination'
                  checkboxId={`destination-checkbox-${item.code}`}
                />
              )
            )}
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </div>
  )
}
