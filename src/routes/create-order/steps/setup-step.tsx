import React, { useEffect, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { FormFeedback, FormGroup, UncontrolledTooltip } from 'reactstrap'
import { get } from 'lodash'
import {
  getFlarePricelist,
  useApiCall
} from '../../../packages/tradefact-api/order'
import { FlarePriceList } from '../../../packages/tradefact-objects/order'
import { useTranslation } from 'react-i18next'

export default function OrderFormSetupStep() {
  const {
    register,
    formState: { errors },
    getValues,
    watch,
    trigger
  } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    name: 'newOrder.lineItems'
  })
  const flarePriceList = useApiCall<FlarePriceList[]>(getFlarePricelist)
  const [selectedFlare, setSelectedFlare] = useState<number>(0)
  const { t } = useTranslation()

  const createFlare = (e: React.MouseEvent) => {
    e.preventDefault()
    append({
      labelText: '',
      lineNumber: fields.length + 1
    })
  }

  const getFlarePrice = (mult?: number) => {
    if (flarePriceList.response !== null) {
      const price = flarePriceList.response[0].price
      if (mult) return (price * mult).toFixed(2)
      else return price.toFixed(2)
    } else return '0.00'
  }

  useEffect(() => {
    // Initialise with an empty flare
    if (fields.length == 0) {
      append({ labelText: '', lineNumber: fields.length + 1 })
      setSelectedFlare(0)
    }
  }, [])

  return (
    <div>
      <h3 className='mb-4'>{t('newOrderForm.addAndSetup')}.</h3>
      <div className='order-form__flare-midrow mb-4'>
        <div
          className='mb-4 order-form__flare-array'
          onChange={() => {
            trigger('newOrder.lineItems')
          }}
        >
          {fields.map((flare: any, i: number) => (
            <div
              key={flare.id}
              className='order-form__flare mb-2'
              id={flare.id}
            >
              <label className='text-secondary m-0'>
                {t('generic.flare')} #{i + 1}
              </label>
              <FormGroup className='m-0'>
                <input
                  maxLength={20}
                  {...register(`newOrder.lineItems.${i}.labelText` as const, {
                    required: {
                      value: true,
                      message: t('validation.validationRequiredMessage', {
                        value: t('newOrderForm.deviceLabel')
                      })
                    },
                    maxLength: {
                      value: 20,
                      message: t('validation.maxLength', {
                        value: t('newOrderForm.deviceLabel'),
                        n: 20
                      })
                    },
                    minLength: {
                      value: 3,
                      message: t('validation.minLength', {
                        value: t('newOrderForm.deviceLabel'),
                        n: 3
                      })
                    }
                  })}
                  placeholder={t('newOrderForm.flarePlaceholder')}
                  className='form-control'
                  onFocus={() => {
                    setSelectedFlare(i)
                  }}
                />
                {get(errors, `newOrder.lineItems.${i}.labelText`) && (
                  <FormFeedback style={{ display: 'inline-block' }} tooltip>
                    {get(errors, `newOrder.lineItems.${i}.labelText.message`)}
                  </FormFeedback>
                )}
              </FormGroup>
              <div
                className='d-flex align-items-center justify-content-center'
                style={{ height: '35px' }}
              >
                {i !== 0 && (
                  <i
                    className='fas fa-trash'
                    onClick={() => {
                      remove(i)
                      setSelectedFlare(0)
                    }}
                  ></i>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className='order-form__flare-display'>
          <div className='mb-1'>
            <h3>
              {t('newOrderForm.deviceLabel')}
              <span id='shipment-details-tooltip'>
                <i className='fas fa-question-circle text-muted cursor-pointer ml-1' />
              </span>
              <UncontrolledTooltip
                placement='bottom'
                target='shipment-details-tooltip'
              >
                <div style={{ maxWidth: '350px' }}>
                  {t('newOrderForm.tooltip.deviceLabel')}.
                </div>
              </UncontrolledTooltip>
            </h3>
          </div>
          <div>
            <label className='h6'>
              <strong>{t('map.tableHeaders.deviceId')}</strong>: 000000000
            </label>
            <label className='h6 my-1 small'>
              <strong>{t('newOrderForm.referenceType')}</strong>:{' '}
              {getValues('newOrder.referenceType')?.label || 'N/A'}
            </label>
            <label className='h3'>
              {getValues('newOrder.referenceNumber')}
            </label>
            <div className='my-2'>
              <label className='h1'>
                <strong>
                  {selectedFlare + 1} OF {fields.length}
                </strong>
              </label>
              <label className='h6 mt-1'>
                {t('generic.devices').toUpperCase()}
              </label>
            </div>
            <label className='h6 small'>
              {t('newOrderForm.deviceLocation')}
            </label>
            <label className='h4'>
              {((watch('newOrder.lineItems')[selectedFlare] as unknown) as {
                labelText: string
              })?.labelText || t('newOrderForm.deviceLabel').toUpperCase()}
            </label>
            <img src='images/logo.svg' />
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-between'>
        <button className='btn btn-secondary text-white' onClick={createFlare}>
          + {t('newOrderForm.addDevice')}
        </button>
        <div className='order-form__setup-prices'>
          <label>
            {t('generic.flares')}:<span> {fields.length}</span>
          </label>
          <label>
            {t('newOrderForm.pricePerFlare')}:<span> ${getFlarePrice()}</span>
          </label>
          <label>
            {t('newOrderForm.total')}:
            <span> ${getFlarePrice(fields.length)}</span>
          </label>
        </div>
      </div>
    </div>
  )
}
