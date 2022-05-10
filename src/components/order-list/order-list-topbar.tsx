import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse
} from 'reactstrap'
import SearchInput from '../../common-components/search-input'
import {
  OrderFilterOptions,
  OrderSortFilter,
  OrderSortType
} from '../../packages/tradefact-objects/dropdown-items'
import { OrderStatus } from '../../packages/tradefact-objects/order'
import {
  saveSortByFilter,
  onSearchChange
} from '../../routes/order-list-view/order-list-view-slice'
import { useAppDispatch } from '../app'

interface OrderListViewTopbarProps {
  DeviceFilterStatus: any[]
  sortFilterStatus: string
  updateOrderStatus: (status: string) => void
  getFilterValue: () => string
  headerText: string
  hasFilter: boolean
}

export default function OrderListTopbar({
  updateOrderStatus,
  DeviceFilterStatus,
  getFilterValue,
  sortFilterStatus,
  headerText,
  hasFilter
}: OrderListViewTopbarProps) {
  const { t } = useTranslation()
  const [searchtext, setSearch] = useState<boolean>(false)
  const isMobile = useMediaQuery({ query: '(max-width: 991px)' })
  const dispatch = useAppDispatch()
  const updateFilter = (sortType: OrderSortType) => {
    dispatch(saveSortByFilter(sortType))
  }
  const handleFilterSelect = (e: React.MouseEvent, value: OrderStatus) => {
    e.preventDefault()
    updateOrderStatus(value.toString())
  }

  return (
    <div className='d-flex flex-column mb-4'>
      <div
        id='topbar'
        className={`d-flex justify-content-between px-4 py-3 bg-white`}
      >
        <div className='d-flex align-items-center'>
          <span className='font-weight600 f5'>{headerText}</span>
        </div>
        <div id='filters' className='d-flex'>
          {hasFilter && (
            <UncontrolledDropdown className='account-dropdown'>
              {isMobile ? (
                <DropdownToggle className='rounded-container'>
                  <i className='far fa-filter'></i>
                </DropdownToggle>
              ) : (
                <DropdownToggle className='rounded-container w-100'>
                  <div className='d-flex align-items-center justify-content-between px-2'>
                    <div>
                      <p className='text-capitalize normal-font'>
                        {getFilterValue()}
                      </p>
                    </div>
                    <div>
                      <i className='fal fa-chevron-down ml-3' />
                    </div>
                  </div>
                </DropdownToggle>
              )}
              <DropdownMenu right>
                {DeviceFilterStatus.map((entry, i) => (
                  <DropdownItem
                    key={i}
                    onClick={e => handleFilterSelect(e, entry.value)}
                  >
                    {t(entry.key)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
          )}
          <UncontrolledDropdown className='account-dropdown sort ml-2'>
            <DropdownToggle className='rounded-container w-100'>
              <div className='d-flex align-items-center justify-content-between px-2'>
                <div>
                  <p className='text-capitalize normal-font'>
                    {t('generic.sort')}
                  </p>
                </div>
                <div>
                  <i className='fal fa-chevron-down ml-3' />
                </div>
              </div>
            </DropdownToggle>
            <DropdownMenu right>
              <span className='sort-by-heading'>{t('generic.sortBy')}</span>
              {OrderFilterOptions.map((item: OrderSortFilter) => (
                <DropdownItem
                  className='dropdownItem'
                  key={item.key}
                  onClick={() => {
                    updateFilter(item.key)
                  }}
                >
                  <div className='form-check'>
                    <input
                      className='form-check-input'
                      type='radio'
                      name='productSorting'
                      value={item.key}
                      defaultChecked={item.key == sortFilterStatus}
                    />
                    <label className='form-check-label' htmlFor='name.asc'>
                      {t(`list.filters.${item.key}`)}
                    </label>
                  </div>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>
          <div className='ml-2 table_search'>
            {isMobile ? (
              <DropdownToggle
                className='account-dropdown rounded-container'
                outline
                onClick={() => setSearch(!searchtext)}
              >
                <i className='far fa-search'></i>
              </DropdownToggle>
            ) : (
              <SearchInput
                placeholder={t('map.searchPosOrDevices')}
                onSearchChange={(search: string) => {
                  dispatch(onSearchChange({ search }))
                }}
              />
            )}
          </div>
        </div>
      </div>
      {isMobile && (
        <Collapse isOpen={searchtext} className='p-3 bg-white'>
          <div className='table_search'>
            <SearchInput
              placeholder={t('map.searchPosOrDevices')}
              onSearchChange={(search: string) => {
                dispatch(onSearchChange({ search }))
              }}
            />
          </div>
        </Collapse>
      )}
    </div>
  )
}
