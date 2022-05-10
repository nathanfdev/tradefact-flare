import { get } from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { DropdownItem } from 'reactstrap'
import { Checkbox } from '../../common-components'
import { useAppDispatch, useAppSelector } from '../../components/app'
import { ALL_COUNTRY_FILTER } from '../../helpers/constants'
import { getAllOrders } from '../../packages/tradefact-api/order'
import { Country } from '../../packages/tradefact-objects'
import { onCountryFilterChange } from '../../routes/dashboard/reducer/order-slice'

interface CountryDropdownItemProps {
  item: Country
  filterKey: string
  checkboxId: string
}

const CountryDropdownItem = ({
  item,
  filterKey,
  checkboxId
}: CountryDropdownItemProps) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const order = useAppSelector(state => state.order)
  const { search } = useAppSelector(state => state.order)
  const { userInfo } = useAppSelector(state => state.user)
  const [checked, setChecked] = useState(false)

  const handleCountryChange = (isChecked: boolean) => {
    if (isChecked) {
      dispatch(
        onCountryFilterChange({
          countryFilters: {
            ...order.countryFilters,
            [filterKey]: item
          }
        })
      )
      dispatch(getAllOrders({ search, userInfo }))
    }
  }

  return (
    <DropdownItem
      tag={Link}
      onClick={e => {
        e.preventDefault()
        setChecked(!checked)
        handleCountryChange(!checked)
      }}
    >
      <Checkbox
        id={checkboxId}
        checked={
          get(order, `countryFilters.${filterKey}.code`, ALL_COUNTRY_FILTER) ===
          item.code
        }
        readOnly={true}
        labelText={item.name === 'All' ? t('generic.all') : item.name}
      />
    </DropdownItem>
  )
}

export default CountryDropdownItem
