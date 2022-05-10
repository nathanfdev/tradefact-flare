import debounce from 'debounce-promise'
import React, { CSSProperties, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormatOptionLabelMeta, ValueType } from 'react-select'
import AsyncSelect from 'react-select/async'
import {
  Alert,
  Button,
  Col,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  Row
} from 'reactstrap'
import { toast } from '../../helpers'
import { getNoOptionsMessage } from '../../helpers/dropdown-labels'
import { createOptions } from '../../helpers/dropdown-options'
import {
  checkForValidAddress1,
  minMaxEmptyCharCheck
} from '../../helpers/validations/validations'
import api from '../../packages/tradefact-api'
import { Address, Country } from '../../packages/tradefact-objects'
import { DropdownOptionType } from '../../packages/tradefact-objects/dropdown-resource'
import { useFields } from '../../packages/use-fields'
import {
  dropdownStyles,
  getDropdownBorderColor
} from '../../styles/dropdown-styles'

interface LocationModalProps {
  isOpen: boolean
  directoryId: string
  editLocation?: Address
  invoiceAddress?: boolean
  onLocationCreated: (location: Address) => void
  onToggle: () => void
}

const LocationModal = ({
  isOpen,
  onToggle,
  editLocation,
  onLocationCreated,
  invoiceAddress
}: LocationModalProps) => {
  const [
    {
      name,
      addressLine1,
      addressLine2,
      addressLine3,
      city,
      country,
      county,
      postalCode
    }
  ] = useFields({
    name: editLocation?.name ?? '',
    addressLine1: editLocation?.addressLine1 ?? '',
    addressLine2: editLocation?.addressLine2 ?? '',
    addressLine3: editLocation?.addressLine3 ?? '',
    city: editLocation?.city ?? '',
    country: editLocation?.country?.code ?? '',
    county: editLocation?.county ?? '',
    postalCode: editLocation?.postalCode ?? ''
  })

  const { t } = useTranslation()

  const [countrySearch, setCountrySearch] = useState(country.value)
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(false)
  const [isValidCheck, setIsValidCheck] = useState(false)
  const [validationErrorCount, setValidationErrorCount] = useState(0)
  const validCountry = isValidCheck && country.value !== ''
  const invalidCountry = isValidCheck && country.value === ''
  const nameValid = minMaxEmptyCharCheck(
    3,
    100,
    name.value.trim(),
    t('location.locationName'),
    true
  )
  const address1Valid = checkForValidAddress1(
    1,
    100,
    addressLine1.value,
    t('location.addressLine1'),
    true
  )
  const address2Valid = minMaxEmptyCharCheck(
    0,
    100,
    addressLine2.value,
    t('location.addressLine2'),
    false
  )
  const address3Valid = minMaxEmptyCharCheck(
    0,
    100,
    addressLine3.value,
    t('location.addressLine3'),
    false
  )
  const cityValid = minMaxEmptyCharCheck(3, 100, city.value, 'City', true)
  const countyValid = minMaxEmptyCharCheck(
    0,
    100,
    county.value,
    t('location.countyLabel'),
    false
  )
  const postcodeValid = minMaxEmptyCharCheck(
    0,
    15,
    postalCode.value,
    t('location.postcodeLabel'),
    false
  )

  const debouncedLoadOptions = useCallback(
    debounce(loadCountryOptions, 300, {
      leading: true
    }),
    []
  )

  function loadCountryOptions(inputValue: string) {
    return new Promise(resolve => {
      resolve(getListCountries(inputValue))
    })
  }

  const getListCountries = (inputValue: string) => {
    return api
      .listCountries(inputValue)
      .then(res => {
        setCountries(res)
        return createOptions<Country>({
          type: 'country',
          objectArray: res
        })
      })
      .catch(() =>
        toast(t('validation.genericToastErrorMessage'), {
          title: t('generic.error'),
          icon: 'danger'
        })
      )
  }

  const toggleAndclearFields = () => {
    onToggle()
    name.update('')
    addressLine1.update('')
    addressLine2.update('')
    addressLine3.update('')
    city.update('')
    country.update('')
    postalCode.update('')
    county.update('')
  }

  const getFieldsValueAsAddressObject = (): Address => {
    const selectedCountry = countries.find(x => x.code === country.value)
    if (selectedCountry) {
      return {
        name: name.value,
        addressLine1: addressLine1.value,
        addressLine2: addressLine2.value,
        addressLine3: addressLine3.value,
        city: city.value,
        countryCode: selectedCountry.code,
        postalCode: postalCode.value,
        county: county.value
      }
    } else {
      return {}
    }
  }

  const validateForm = (): boolean => {
    let validationErrorCount = 0
    if (!nameValid.Valid) {
      validationErrorCount++
    }
    if (!address1Valid.Valid) {
      validationErrorCount++
    }
    if (!address2Valid.Valid) {
      validationErrorCount++
    }
    if (!address3Valid.Valid) {
      validationErrorCount++
    }
    if (!cityValid.Valid) {
      validationErrorCount++
    }
    if (!country.value) {
      validationErrorCount++
    }
    if (!countyValid.Valid) {
      validationErrorCount++
    }
    if (!postcodeValid.Valid) {
      validationErrorCount++
    }
    if (validationErrorCount > 0) {
      setValidationErrorCount(validationErrorCount)
      return false
    } else {
      return true
    }
  }

  useEffect(() => {
    if (
      isValidCheck &&
      nameValid.Valid &&
      address1Valid.Valid &&
      address2Valid.Valid &&
      address3Valid.Valid &&
      cityValid.Valid &&
      countyValid.Valid &&
      postcodeValid.Valid &&
      country.value !== ''
    ) {
      setValidationErrorCount(0)
    }
  }, [
    name.value,
    addressLine1.value,
    addressLine2.value,
    addressLine3.value,
    city.value,
    county.value,
    country.value,
    postalCode.value,
    isValidCheck,
    nameValid.Valid,
    address1Valid.Valid,
    address2Valid.Valid,
    address3Valid.Valid,
    cityValid.Valid,
    countyValid.Valid,
    postcodeValid.Valid
  ])

  const saveLocation = () => {
    setIsValidCheck(true)
    if (validateForm()) {
      if (invoiceAddress) {
        if (!editLocation?.addressLine1) {
          api
            .createCompanyInvoiceAddress(getFieldsValueAsAddressObject())
            .then((location: Address) => {
              toast(t('location.toast.addedSuccessMessage'), {
                title: t('location.toast.companyAddressTitle'),
                icon: 'success'
              })
              location.id && onLocationCreated(location)
              toggleAndclearFields()
            })
            .catch(() =>
              toast(t('validation.genericToastErrorMessage'), {
                title: t('generic.error'),
                icon: 'danger'
              })
            )
        } else {
          setLoading(true)
          api
            .updateCompanyInvoiceAddress(getFieldsValueAsAddressObject())
            .then((location: Address) => {
              toast(t('location.toast.updatedSuccessMessage'), {
                title: t('location.toast.companyAddressTitle'),
                icon: 'success'
              })
              location.id && onLocationCreated(location)
              toggleAndclearFields()
            })
            .catch(() =>
              toast(t('validation.genericToastErrorMessage'), {
                title: t('generic.error'),
                icon: 'danger'
              })
            )
            .finally(() => {
              setLoading(false)
            })
        }
      } else {
        if (!editLocation?.id) {
          api
            .addNewAddressToCompany(getFieldsValueAsAddressObject())
            .then((location: Address) => {
              toast(t('location.toast.updatedSuccessMessage'), {
                title: t('location.toast.companyAddressTitle'),
                icon: 'success'
              })
              location.id && onLocationCreated(location)
              toggleAndclearFields()
            })
            .catch(() =>
              toast(t('validation.genericToastErrorMessage'), {
                title: t('generic.error'),
                icon: 'danger'
              })
            )
        } else {
          setLoading(true)
          api
            .updateAddress(editLocation?.id, getFieldsValueAsAddressObject())
            .then((location: Address) => {
              toast(
                t('location.toast.updatedLocationSuccessMessage', {
                  locationName: location.name || ''
                }),
                {
                  title: t('location.toast.updatedLocationTitle'),
                  icon: 'success'
                }
              )
              location.id && onLocationCreated(location)
              toggleAndclearFields()
            })
            .catch(() =>
              toast(t('validation.genericToastErrorMessage'), {
                title: t('generic.error'),
                icon: 'danger'
              })
            )
            .finally(() => {
              setLoading(false)
            })
        }
      }
    }
  }

  const countryBorderStyles = getDropdownBorderColor(
    validCountry,
    invalidCountry
  )

  const countryDropdownStyles = {
    ...dropdownStyles,
    control: (provided: CSSProperties) => ({
      ...dropdownStyles.control(provided),
      ...countryBorderStyles
    })
  }

  return (
    <Modal isOpen={isOpen} M size='lg'>
      <div className='modal-header'>
        <h5 className='modal-title'>
          {invoiceAddress
            ? editLocation?.name
              ? t('location.editLocation', {
                  locationName: editLocation?.name || 'Unkown'
                })
              : t('location.addCompanyAddress')
            : editLocation?.addressLine1
            ? t('location.editLocation', {
                locationName: editLocation?.name || 'Unkown'
              })
            : t('location.newLocation')}
        </h5>
        <button
          type='button'
          className='close'
          data-dismiss='modal'
          aria-label='Close'
          onClick={toggleAndclearFields}
        >
          <span aria-hidden='true'>
            <i className='fal fa-times'></i>
          </span>
        </button>
      </div>
      <ModalBody>
        <Row>
          <Col sm={12} md={12}>
            <FormGroup>
              <Label className='quote-label'>
                {t('location.locationName')}
              </Label>
              <Input
                type='text'
                placeholder={`${t('location.locationName')}...`}
                id={name.id}
                name={name.name}
                value={name.value}
                onChange={e => name.update(e.target.value)}
                invalid={isValidCheck && !nameValid.Valid}
                valid={isValidCheck && nameValid.Valid}
              />
              <FormFeedback tooltip>{nameValid.Message}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12}>
            <FormGroup>
              <Label className='quote-label'>
                {t('location.addressLine1')}
              </Label>
              <Input
                type='text'
                placeholder={`${t('location.addressLine1')}...`}
                id={addressLine1.id}
                name={addressLine1.name}
                value={addressLine1.value}
                onChange={e => addressLine1.update(e.target.value)}
                invalid={isValidCheck && !address1Valid.Valid}
                valid={isValidCheck && address1Valid.Valid}
              />
              <FormFeedback tooltip>{address1Valid.Message}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12}>
            <FormGroup>
              <Label className='quote-label'>
                {t('location.addressLine2')} {t('generic.optionalLabel')}
              </Label>
              <Input
                type='text'
                placeholder={`${t('location.addressLine2')}...`}
                id={addressLine2.id}
                name={addressLine2.name}
                value={addressLine2.value}
                onChange={e => addressLine2.update(e.target.value)}
                invalid={isValidCheck && !address2Valid.Valid}
              />
              <FormFeedback tooltip>{address2Valid.Message}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12}>
            <FormGroup>
              <Label className='quote-label'>
                {t('location.addressLine3')} {t('generic.optionalLabel')}
              </Label>
              <Input
                type='text'
                placeholder={`${t('location.addressLine3')}...`}
                id={addressLine3.id}
                name={addressLine3.name}
                value={addressLine3.value}
                onChange={e => addressLine3.update(e.target.value)}
                invalid={isValidCheck && !address3Valid.Valid}
              />
              <FormFeedback tooltip>{address3Valid.Message}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6}>
            <FormGroup>
              <Label className='quote-label'>{t('location.cityTown')}</Label>
              <Input
                type='text'
                placeholder={`${t('location.city')}...`}
                id={city.id}
                name={city.name}
                value={city.value}
                onChange={e => city.update(e.target.value)}
                invalid={isValidCheck && !cityValid.Valid}
                valid={isValidCheck && cityValid.Valid}
              />
              <FormFeedback tooltip>{cityValid.Message}</FormFeedback>
            </FormGroup>
          </Col>
          <Col sm={12} md={6}>
            <FormGroup>
              <Label className='quote-label'>
                {t('location.postcodeLabel')} {t('generic.optionalLabel')}
              </Label>
              <Input
                type='text'
                placeholder={`${t('location.postcodeLabel')}...`}
                id={postalCode.id}
                name={postalCode.name}
                value={postalCode.value}
                onChange={e => postalCode.update(e.target.value)}
                invalid={isValidCheck && !postcodeValid.Valid}
              />
              <FormFeedback tooltip>{postcodeValid.Message}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6}>
            <FormGroup>
              <Label className='quote-label'>
                {t('location.countyLabel')} {t('generic.optionalLabel')}
              </Label>
              <Input
                type='text'
                placeholder={`${t('location.countyLabel')}...`}
                id={county.id}
                name={county.name}
                value={county.value}
                onChange={e => county.update(e.target.value)}
                invalid={isValidCheck && !countyValid.Valid}
              />
              <FormFeedback tooltip>{countyValid.Message}</FormFeedback>
            </FormGroup>
          </Col>
          <Col sm={12} md={6}>
            <FormGroup>
              <Label className='quote-label'>{t('location.country')}</Label>
              <AsyncSelect
                id='countryDropdown'
                name='countryDropdown'
                styles={countryDropdownStyles}
                loadOptions={debouncedLoadOptions}
                defaultOptions={true}
                noOptionsMessage={() => getNoOptionsMessage(countrySearch)}
                value={
                  countrySearch
                    ? ({ label: countrySearch, value: {} } as ValueType<
                        DropdownOptionType<Country>
                      >)
                    : null
                }
                formatOptionLabel={(
                  options: DropdownOptionType<Country>,
                  meta: FormatOptionLabelMeta<DropdownOptionType<Country>>
                ) => (
                  <div className='searchable-dropdown__container'>
                    <div className='searchable-dropdown__result__icon'>
                      <i className='far fa-map-marker-alt'></i>
                    </div>
                    <div className='searchable-dropdown__result__inner'>
                      <span className='searchable-dropdown__result__heading'>
                        <span>{options.label.split('|')[0]}</span>
                        {meta.context === 'menu' && (
                          <span className='searchable-dropdown__result__code text-white badge badge-secondary'>
                            {options.label.split('|')[1]}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
                placeholder={`${t('location.country')}...`}
                onChange={(option: ValueType<DropdownOptionType<Country>>) => {
                  country.update(
                    (option as DropdownOptionType<Country>)?.value?.code || ''
                  )
                  setCountrySearch(
                    (option as DropdownOptionType<Country>)?.label || ''
                  )
                }}
                onInputChange={(value, { action }) => {
                  if (action === 'input-change') {
                    country.update('')
                    setCountrySearch(value)
                  }
                }}
                className='basic-single'
                classNamePrefix='select'
                isSearchable
                isClearable
              />

              {isValidCheck && countrySearch === '' && country.value === '' && (
                <Input invalid hidden={true} />
              )}
              <FormFeedback tooltip>
                {t('location.countryIsRequired')}
              </FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        {validationErrorCount > 0 && (
          <Row>
            <Col>
              <Alert color='danger'>
                {t('validation.seeAboveErrorMessage')}
              </Alert>
            </Col>
          </Row>
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          outline
          color='primary'
          onClick={toggleAndclearFields}
          role='location-modal-cancel'
          className='rounded-container'
        >
          {t('generic.cancel')}
        </Button>
        <Button
          color='primary'
          className='rounded-container px-4'
          onClick={saveLocation}
          disabled={loading}
        >
          {loading && (
            <span
              className='spinner-border spinner-border-sm mr-2'
              role='status'
              aria-hidden='true'
            ></span>
          )}
          {t('generic.save')}
        </Button>{' '}
      </ModalFooter>
    </Modal>
  )
}

export default LocationModal
