import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  UncontrolledTooltip,
  Row,
  Col,
  Label,
  FormGroup,
  Input
} from 'reactstrap'
import { ControlledInput } from '../../../common-components/controlled-input'
import ControlledSelect from '../../../common-components/controlled-select'
import { get, size } from 'lodash'
import { ControlledDatepicker } from '../../../common-components/controlled-date'
import DeliveryBanner from '../components/delivery-banner'
import {
  resetState,
  saveCountryFilter,
  toggleStepValidity
} from '../../../reducers/create-order-slice'
import { useAppDispatch, useAppSelector } from '../../../components/app'
import { getEarliestShipmentDate } from '../../../packages/tradefact-api/order'
import { Steps } from '../../../packages/tradefact-objects/order'
import ControlledAsync from '../../../common-components/controlled-async'
import {
  invalidDropdownStyles,
  countryDropdownStyles
} from '../../../styles/dropdown-styles'
import { FlareCountrySelectLabel } from '../../../helpers/dropdown-labels'

export default function OrderFormShipmentStep() {
  const {
    getValues,
    setValue,
    formState: { errors }
  } = useFormContext()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { countryFilter, earliestShipmentDate } = useAppSelector(
    state => state.orderForm
  )

  useEffect(() => {
    if (countryFilter?.value?.code) {
      dispatch(getEarliestShipmentDate(countryFilter.value.code))
      setValue('countryFilter', countryFilter) // resave the country filter
    } else if (countryFilter == null) {
      dispatch(resetState('earliestShipmentDate'))
    }
  }, [countryFilter])

  return (
    <div>
      {earliestShipmentDate !== undefined &&
        earliestShipmentDate?.earliestDate !== '' &&
        countryFilter?.value && <DeliveryBanner delay={earliestShipmentDate} />}
      <h3>
        {t('newOrderForm.tellUs')}.
        <span id='shipment-details-tooltip'>
          <i className='fas fa-question-circle text-muted cursor-pointer ml-1' />
        </span>
        <UncontrolledTooltip
          placement='bottom'
          target='shipment-details-tooltip'
        >
          <div style={{ maxWidth: '350px' }}>
            {t('newOrderForm.tooltip.shipment')}.
          </div>
        </UncontrolledTooltip>
      </h3>
      <div>
        <Row className='mb-2'>
          <Col className='order-form__group'>
            <ControlledInput
              label={t('newOrderForm.shipmentName')}
              placeholder={t('newOrderForm.placeholder.shipmentName')}
              name='newOrder.shipmentName'
              rules={{
                required: {
                  value: true,
                  message: t('validation.validationRequiredMessage', {
                    value: t('newOrderForm.shipmentName')
                  })
                },
                minLength: {
                  value: 3,
                  message: t('validation.minLength', {
                    value: t('newOrderForm.shipmentName'),
                    n: 3
                  })
                },
                maxLength: {
                  value: 20,
                  message: t('validation.maxLength', {
                    value: t('newOrderForm.shipmentName'),
                    n: 20
                  })
                }
              }}
            />
          </Col>
        </Row>
        <Row className='mb-2'>
          <Col className='order-form__group'>
            <ControlledSelect
              label={`${t('newOrderForm.referenceType')} ${t(
                'generic.optionalLabel'
              )}`}
              placeholder={t('newOrderForm.placeholder.referenceType')}
              name={'newOrder.referenceType'}
              options={[
                { value: '0', label: t('newOrderForm.purchaseOrderNumber') },
                { value: '1', label: t('newOrderForm.shipmentOrderNumber') }
              ]}
            />
          </Col>
          <Col className='order-form__group'>
            <ControlledInput
              label={`${t('newOrderForm.reference')} ${t(
                'generic.optionalLabel'
              )}`}
              placeholder={t('newOrderForm.placeholder.referenceNumber')}
              name='newOrder.referenceNumber'
              rules={{
                required: {
                  value: getValues('newOrder.referenceType'),
                  message:
                    'A reference is required after selecting a reference type'
                },
                minLength: {
                  value: 3,
                  message: t('validation.minLength', {
                    value: t('newOrderForm.referenceNumber'),
                    n: 3
                  })
                },
                maxLength: {
                  value: 20,
                  message: t('validation.maxLength', {
                    value: t('newOrderForm.referenceNumber'),
                    n: 20
                  })
                }
              }}
            />
          </Col>
          <Col className='order-form__group'>
            <ControlledSelect
              label={t('newOrderForm.mode')}
              placeholder={t('newOrderForm.placeholder.transportMode')}
              name={'newOrder.transportMode'}
              options={[
                { value: '0', label: t('newOrderForm.modes.air') },
                { value: '1', label: t('newOrderForm.modes.sea') },
                { vlaue: '2', label: t('newOrderForm.modes.road') },
                { value: '3', label: t('newOrderForm.modes.rail') }
              ]}
              rules={{
                required: {
                  value: true,
                  message: t('validation.validationRequiredMessage', {
                    value: t('newOrderForm.mode')
                  })
                }
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col className='mt-3'>
            <h3>{t('newOrderForm.dispatchLocation')}</h3>
          </Col>
        </Row>
        <Row className='mb-2'>
          <Col className='order-form__group'>
            <ControlledAsync
              name={'countryFilter'}
              label={t('newOrderForm.origin')}
              placeholder={t('newOrderForm.placeholder.country')}
              value={countryFilter}
              preset={'country'}
              onChange={(val: any) => {
                setValue('countryFilter', val)
                setValue('newOrder.shipmentDate', '')
                dispatch(
                  toggleStepValidity({ target: Steps.SHIPMENT, value: false })
                )
                dispatch(saveCountryFilter(val))
              }}
              rules={{
                validate: (value: any) =>
                  size(value) > 0 || t('location.locationRequired')
              }}
              styles={
                get(errors, 'countryFilter')
                  ? invalidDropdownStyles
                  : countryDropdownStyles
              }
              formatOptionLabel={FlareCountrySelectLabel}
            />
          </Col>
          <Col className='order-form__group'>
            {countryFilter !== '' && countryFilter !== null ? (
              <ControlledDatepicker
                label={t('newOrderForm.shipmentDate')}
                placeholder={t('newOrderForm.selectShipment')}
                name={'newOrder.shipmentDate'}
                minDate={earliestShipmentDate?.earliestDate}
                rules={{
                  required: {
                    value: true,
                    message: t('validation.validationRequiredMessage', {
                      value: t('newOrderForm.shipmentDate')
                    })
                  }
                }}
              />
            ) : (
              <FormGroup>
                <Label>{t('newOrderForm.shipmentDate')}</Label>
                <Input
                  disabled
                  placeholder={t('newOrderForm.enterOriginFirst')}
                />
              </FormGroup>
            )}
          </Col>
        </Row>
      </div>
    </div>
  )
}
