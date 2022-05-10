import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Col, Row, ModalFooter, Input, Label, FormGroup } from 'reactstrap'
import { ControlledInput } from '../../../common-components/controlled-input'
import { useAppDispatch, useAppSelector } from '../../../components/app'
import { saveAddress, resetState } from '../../../reducers/create-order-slice'
import { AddressFormUnionType } from '../steps/delivery-step'
import { get, size } from 'lodash'
import {
  createAddress,
  updateSavedAddress
} from '../../../packages/tradefact-api/address'
import { useTranslation } from 'react-i18next'
import ControlledAsync from '../../../common-components/controlled-async'
import { FlareCountrySelectLabel } from '../../../helpers/dropdown-labels'
import {
  invalidDropdownStyles,
  countryDropdownStyles
} from '../../../styles/dropdown-styles'

export default function AddressInputForm() {
  const {
    addressFormState,
    locallySavedAddresses,
    countryFilter
  } = useAppSelector(state => state.orderForm)
  const {
    getValues,
    setValue,
    unregister,
    trigger,
    formState: { errors }
  } = useFormContext()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const originOrDest: AddressFormUnionType =
    addressFormState.originOrDestination

  const handleCancelForm = () => {
    setValue('pendingUpdate', {})
    dispatch(resetState('addressFormState'))
  }

  const handleCreateAddress = async (e: React.MouseEvent) => {
    // The entire Address Form is kept in a temp "pendingUpdate" field due to mutability errors with Redux
    const value = getValues('pendingUpdate')
    const target = originOrDest
    e.preventDefault()

    await trigger('pendingUpdate').then(pass => {
      // If preloaded = true, the form should edit rather than create
      const isEdit = addressFormState.preLoadedAddress

      if (pass) {
        if (!isEdit) {
          // For each address, we POSt a new address request then pass the returned ID
          // back to retrieve the new detials, which we save locally for rendering
          value.countryCode = countryFilter.value.code
          value.countryName = countryFilter.value.name

          createAddress(value).then((res: any) => {
            setValue(`locallySavedAddresses.${originOrDest}`, value)
            setValue(`newOrder.${originOrDest}`, res.id)
            unregister('pendingUpdate')
            dispatch(saveAddress({ target, value }))
            dispatch(resetState('addressFormState'))
            trigger()
          })
        } else {
          value.countryCode = value.country.code || value.country.value.code
          updateSavedAddress(value.id, value).then((res: any) => {
            res = { ...res, ...{ savedAsName: value.saveAsName } }
            setValue(`locallySavedAddresses.${originOrDest}`, res)
            unregister('pendingUpdate') // unregister to prevent errors
            dispatch(saveAddress({ target, value: res }))
            dispatch(resetState('addressFormState'))
          })
        }
      }
    })
  }

  // If opened in edit mode, populate all fields with existing data
  useEffect(() => {
    if (addressFormState.preLoadedAddress) {
      const fields = locallySavedAddresses[originOrDest]
      Object.entries(fields).forEach(([key, val]) => {
        setValue(`pendingUpdate.${key}`, val)
      })
      if (fields.savedAsName) {
        setValue(`pendingUpdate.saveAsName`, fields.savedAsName)
      } else {
        setValue(`pendingUpdate.saveAsName`, fields?.saveAsName)
      }
    }
  }, [])

  return (
    <div>
      <Row>
        <Col className='order-form__group'>
          <ControlledInput
            label={t('location.addressLine1')}
            name='pendingUpdate.addressLine1'
            rules={{
              required: {
                value: true,
                message: t('validation.required', {
                  value: t('location.addressLine1')
                })
              }
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col className='order-form__group'>
          <ControlledInput
            label={`${t('location.addressLine2')} ${t(
              'generic.optionalLabel'
            )}`}
            name='pendingUpdate.addressLine2'
          />
        </Col>
      </Row>
      <Row>
        <Col className='order-form__group'>
          <ControlledInput
            label={`${t('location.addressLine3')} ${t(
              'generic.optionalLabel'
            )}`}
            name='pendingUpdate.addressLine3'
          />
        </Col>
      </Row>
      <Row>
        <Col className='order-form__group'>
          <ControlledInput
            label={t('location.city')}
            name='pendingUpdate.city'
            rules={{
              required: {
                value: true,
                message: t('validation.required', {
                  value: t('location.city')
                })
              }
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col className='order-form__group'>
          <ControlledInput
            label={t('location.postcodeLabel')}
            name='pendingUpdate.postalCode'
            rules={{
              required: {
                value: true,
                message: t('validation.required', {
                  value: t('location.postcodeLabel')
                })
              }
            }}
          />
        </Col>
        <Col className='order-form__group'>
          {originOrDest === 'deliveryAddressId' ? (
            <FormGroup className='m-0'>
              <Label>Country</Label>
              <Input value={countryFilter.value.name} disabled />
            </FormGroup>
          ) : (
            <ControlledAsync
              name={'pendingUpdate.country'}
              label={t('location.country')}
              preset={'country'}
              onChange={(value: any) => {
                setValue('pendingUpdate.country', value)
              }}
              rules={{
                validate: (value: any) =>
                  size(value) > 0 || t('location.locationRequired')
              }}
              defaultValue={{
                label: locallySavedAddresses[originOrDest]?.country?.name || '',
                value: {
                  name:
                    locallySavedAddresses[originOrDest]?.country?.name || '',
                  code: locallySavedAddresses[originOrDest]?.country?.code || ''
                }
              }}
              styles={
                get(errors, 'countryFilter')
                  ? invalidDropdownStyles
                  : countryDropdownStyles
              }
              formatOptionLabel={FlareCountrySelectLabel}
            />
          )}
        </Col>
        <Col className='order-form__group'>
          <ControlledInput
            label={t('location.contactName')}
            name='pendingUpdate.name'
            rules={{
              required: {
                value: true,
                message: t('validation.required', {
                  value: t('location.contactName')
                })
              }
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col className='order-form__group'>
          <ControlledInput
            label={t('location.locationName')}
            name='pendingUpdate.saveAsName'
            rules={{
              required: {
                value: true,
                message: t('validation.required', {
                  value: t('location.locationName')
                })
              }
            }}
          />
        </Col>
      </Row>

      <ModalFooter className='border-0 d-flex justify-content-end p-0 pt-4'>
        <button className='btn btn-outline-primary' onClick={handleCancelForm}>
          {t('generic.cancel')}
        </button>
        <button
          className='btn btn-primary'
          type='submit'
          onClick={handleCreateAddress}
        >
          {t('newOrderForm.saveAddress')}
        </button>
      </ModalFooter>
    </div>
  )
}
