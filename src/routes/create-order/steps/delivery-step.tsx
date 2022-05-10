import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { FormGroup, UncontrolledTooltip } from 'reactstrap'
import { useAppDispatch, useAppSelector } from '../../../components/app'
import { getFormattedSavedAddresses } from '../../../packages/tradefact-api/address'
import {
  saveAddress,
  openAddressForm
} from '../../../reducers/create-order-slice'
import { locationDropdownStyles } from '../../../styles/dropdown-styles'
import AddressInputForm from '../components/address-input-form'
import { size } from 'lodash'
import { useTranslation } from 'react-i18next'
import { FlareCountrySelectLabel } from '../../../helpers/dropdown-labels'
import ControlledAsync from '../../../common-components/controlled-async'

const addressFormTypes = ['deliveryAddressId', 'destinationAddressId'] as const
export type AddressFormUnionType = typeof addressFormTypes[number]

export default function OrderFormDeliveryStep() {
  const {
    addressFormState,
    countryFilter,
    locallySavedAddresses
  } = useAppSelector(state => state.orderForm)
  const { setValue, getValues } = useFormContext()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const handleSelectAddress = (target: AddressFormUnionType, val: any) => {
    {
      if (val !== null) {
        setValue(`locallySavedAddresses.${target}`, val.value)
        setValue(`newOrder.${target}`, val.value.id)
        dispatch(saveAddress({ target, value: val.value }))
      } else {
        // for clearing the option
        setValue(`locallySavedAddresses.${target}`, {})
        setValue(`newOrder.${target}`, undefined)
        dispatch(saveAddress({ target, value: {} }))
      }
    }
  }

  const handleCreateAddress = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    dispatch(
      openAddressForm({
        preLoadedAddress: false,
        toggleForm: true,
        originOrDestination: e.currentTarget.dataset[
          'target'
        ] as AddressFormUnionType
      })
    )
  }

  const editSelectedAddress = (e: React.MouseEvent) => {
    dispatch(
      openAddressForm({
        preLoadedAddress: true,
        toggleForm: true,
        originOrDestination: e.currentTarget.id as AddressFormUnionType
      })
    )
  }

  const getAddressName = (addressKey: AddressFormUnionType) => {
    const address = getValues(`locallySavedAddresses.${addressKey}`)
    if (size(address) === 0) {
      return { label: t('location.searchPlaceholder'), value: {} }
    } else {
      return {
        label:
          getValues(`locallySavedAddresses.${addressKey}.savedAsName`) ||
          getValues(`locallySavedAddresses.${addressKey}.saveAsName`),
        value: getValues(`locallySavedAddresses.${addressKey}`)
      }
    }
  }

  const AddressBlock = ({
    addressData,
    addressKey
  }: {
    addressKey: AddressFormUnionType
    addressData: any
  }) => {
    return (
      <div className='mb-3 order-form__address-block'>
        <ul>
          <li className='font-weight-bold mb-2'>
            {addressData?.name || 'Contact Name'}
          </li>
          <li>{addressData?.addressLine1}</li>
          <li>{addressData?.addressLine2}</li>
          <li>{addressData?.city}</li>
          <li>{addressData?.postalCode}</li>
          <li>{addressData?.countryName || addressData?.country?.name}</li>
        </ul>
        <button
          className='btn rounded container btn-outline-secondary account-dropdown'
          onClick={editSelectedAddress}
          id={addressKey as string}
        >
          <i className='fas fa-pen'></i>
        </button>
      </div>
    )
  }

  const debouncedLoadOptions = {
    delivery: (input: string) =>
      getFormattedSavedAddresses(input, countryFilter?.value.code),
    destination: (input: string) =>
      getFormattedSavedAddresses(
        input,
        '',
        getValues(`locallySavedAddresses.deliveryAddressId.id`)
      )
  }

  useEffect(() => {
    if (
      locallySavedAddresses.deliveryAddressId?.country?.code !==
      countryFilter.value.code
    ) {
      setValue('locallySavedAddresses.deliveryAddressId', {})
    }
  }, [])

  const AddressListView = () => (
    <div>
      {addressFormTypes.map((addressKey: AddressFormUnionType, i) => (
        <div key={i}>
          <FormGroup>
            <h3 className='mb-3'>
              {i == 0
                ? t('newOrderForm.trackingFrom')
                : t('newOrderForm.trackingTo')}
              .
              <span id={`${addressKey}-details-tooltip`}>
                <i className='fas fa-question-circle text-muted cursor-pointer ml-1' />
              </span>
              <UncontrolledTooltip
                placement='bottom'
                target={`${addressKey}-details-tooltip`}
              >
                <div style={{ maxWidth: '200px' }}>
                  {i == 0
                    ? t('newOrderForm.tooltip.trackingFrom')
                    : t('newOrderForm.tooltip.trackingTo')}
                  .
                </div>
              </UncontrolledTooltip>
            </h3>
            <ControlledAsync
              name={`locallySavedAddresses.${addressKey}`}
              rules={{
                validate: (value: any) =>
                  size(value) > 0 || t('location.locationRequired').toString()
              }}
              onChange={(e: any) => {
                handleSelectAddress(addressKey, e)
              }}
              styles={locationDropdownStyles}
              value={getAddressName(addressKey)}
              loadOptions={
                addressKey == 'deliveryAddressId'
                  ? debouncedLoadOptions.delivery
                  : debouncedLoadOptions.destination
              }
              formatOptionLabel={FlareCountrySelectLabel}
            />
          </FormGroup>
          {size(getValues(`locallySavedAddresses.${addressKey}`)) > 0 && (
            <AddressBlock
              addressData={getValues(`locallySavedAddresses.${addressKey}`)}
              addressKey={addressKey}
            />
          )}
          <div>
            <button
              className={`btn btn-secondary text-white ${i == 0 ? 'mb-4' : ''}`}
              onClick={handleCreateAddress}
              data-target={addressKey}
            >
              + {t('newOrderForm.addAddress')}
            </button>
          </div>
        </div>
      ))}
    </div>
  )

  return addressFormState.toggleForm ? (
    <AddressInputForm />
  ) : (
    <AddressListView />
  )
}
