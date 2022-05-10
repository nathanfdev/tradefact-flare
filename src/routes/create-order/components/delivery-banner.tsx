import moment from 'moment'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { EarliestShipmentDate } from '../../../packages/tradefact-objects/order'

export default function DeliveryBanner({
  delay,
  subtext
}: {
  delay: EarliestShipmentDate
  subtext?: string
}) {
  const { t } = useTranslation()

  const getTime = () => {
    const now = moment(new Date())
    const cutoffTime = [13, 1]
    const cutoff = moment(new Date().setHours(cutoffTime[0], 0, 0, 0))
    const diff = moment(cutoff.diff(now))

    if (now < cutoff) {
      return t('newOrderForm.beforeCutoff', {
        hours: diff.hours(),
        minutes: diff.minutes()
      })
    } else {
      return t('newOrderForm.afterCutoff', {
        cutoffTime: cutoffTime[1]
      })
    }
  }

  if (delay !== undefined) {
    return (
      <div className='mb-4 w-100 order-form__banner text-primary font-weight-bold'>
        <div
          dangerouslySetInnerHTML={{
            __html:
              t('newOrderForm.deliveryNotice', {
                date: moment(delay.earliestDate).format('LL'),
                time: getTime()
              }) + '.'
          }}
        ></div>
        {subtext && <div className='mt-2'>{subtext}</div>}
      </div>
    )
  } else return null
}
