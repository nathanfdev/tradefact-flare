import { get, isEmpty } from 'lodash'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '../../common-components'
import { useAppDispatch, useAppSelector } from '../../components/app'
import { updateUserPreferences } from '../../packages/tradefact-api'
import { OrderStatus } from '../../packages/tradefact-objects/order'
import { onStatusChange } from '../../routes/dashboard/reducer/order-slice'
import { insertDataIntoMapPreferences } from './preferences'

const StatusFilter = () => {
  const { userInfo } = useAppSelector(state => state.user)
  const userPreferences = get(userInfo, 'userPreferences', {})
  const statusFilters = get(userPreferences, 'map.statusFilters', [])
  const [isActiveChecked, setIsActiveChecked] = useState<boolean>(true)
  const [isPendingChecked, setIsPendingChecked] = useState<boolean>(true)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isEmpty(userPreferences)) {
      setIsActiveChecked(statusFilters.includes(OrderStatus.TrackingActive))
      setIsPendingChecked(
        statusFilters.includes(OrderStatus.AwaitingFulfillment)
      )
    }
  }, [userPreferences])

  const addOrRemoveFromStatusFilter = (
    statusKey: OrderStatus,
    checked: boolean
  ) => {
    return checked
      ? [...statusFilters, statusKey]
      : statusFilters.filter((x: any) => x !== statusKey)
  }

  return (
    <div className='mb-3 py-2 px-3 border rounded d-flex flex-column justify-content-between'>
      <Checkbox
        id={`active-status-filter`}
        checked={isActiveChecked}
        labelText={t('generic.activeDevices')}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const checked = e.target.checked
          setIsActiveChecked(checked)
          dispatch(
            onStatusChange({ isActiveChecked: checked, isPendingChecked })
          )

          const dataToStore = addOrRemoveFromStatusFilter(
            OrderStatus.TrackingActive,
            checked
          )

          dispatch(
            updateUserPreferences({
              userId: userInfo?.id,
              body: insertDataIntoMapPreferences(
                userPreferences,
                'statusFilters',
                dataToStore
              )
            })
          )
        }}
      />
      <Checkbox
        id={`pending-status-filter`}
        checked={isPendingChecked}
        labelText={t('map.pendingDevices')}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const checked = e.target.checked
          setIsPendingChecked(x => !x)
          dispatch(
            onStatusChange({ isActiveChecked, isPendingChecked: checked })
          )

          const dataToStore = addOrRemoveFromStatusFilter(
            OrderStatus.AwaitingFulfillment,
            checked
          )

          dispatch(
            updateUserPreferences({
              userId: userInfo?.id,
              body: insertDataIntoMapPreferences(
                userPreferences,
                'statusFilters',
                dataToStore
              )
            })
          )
        }}
      />
    </div>
  )
}

export default StatusFilter
