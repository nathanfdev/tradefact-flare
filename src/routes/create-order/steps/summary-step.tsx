import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Col, Row } from 'reactstrap'
import { useAppSelector } from '../../../components/app'
import {
  getFlarePricelist,
  useApiCall
} from '../../../packages/tradefact-api/order'
import {
  FlarePriceList,
  LineItemRequest
} from '../../../packages/tradefact-objects/order'
import DeliveryBanner from '../components/delivery-banner'

export default function OrderFormSummaryStep() {
  const { getValues } = useFormContext()
  const { t } = useTranslation()
  const lineItems = getValues('newOrder.lineItems')
  const address = getValues('locallySavedAddresses.deliveryAddressId')
  const { earliestShipmentDate } = useAppSelector(state => state.orderForm)

  const flarePriceList = useApiCall<FlarePriceList[]>(getFlarePricelist)

  const getFlarePrice = () => {
    if (flarePriceList.response !== null)
      return flarePriceList.response[0].price
    else return 0
  }

  return (
    <div className='order-form__flare-summary'>
      <DeliveryBanner
        delay={earliestShipmentDate}
        subtext={`${t('newOrderForm.deliveringTo')}: ${[
          address?.addressLine1,
          address?.addressLine2,
          address?.addressLine3,
          address?.country?.name || address?.countryName,
          address?.postalCode
        ]
          .filter(x => x)
          .join(', ')}`}
      />
      <h3 className='pb-4 mb-4'>{t('newOrderForm.confirm')}:</h3>
      <Row>
        <Col>
          <div className='text-secondary'>
            {t('newOrderForm.orderCount', { value: lineItems.length })}.
          </div>
          <ul className='mb-2'>
            {lineItems.map((item: LineItemRequest, i: number) => (
              <li className='ml-4' key={i}>
                <span className='text-secondary'>
                  {t('generic.flare')} {i + 1} -{' '}
                </span>
                <span>{item.labelText}</span>
              </li>
            ))}
          </ul>
          <div className='order-form__flare-summary__total'>
            {t('newOrderForm.total')}:{' '}
            <span className='text-primary'>
              ${(lineItems.length * getFlarePrice()).toFixed(2)}
            </span>
          </div>
        </Col>
        <Col>
          <div>
            <span className='text-secondary'>
              {t('newOrderForm.orderDelivery')}:
            </span>
            <address>
              <div className='font-weight-bold'>{address?.name}</div>
              <div>{address?.addressLine1}</div>
              <div>{address?.addressLine2}</div>
              <div>{address?.addressLine3}</div>
              <div>{address?.city}</div>
              <div>{address?.postalCode}</div>
              <div>{address?.country?.name || address?.countryName}</div>
            </address>
          </div>
        </Col>
      </Row>
    </div>
  )
}
