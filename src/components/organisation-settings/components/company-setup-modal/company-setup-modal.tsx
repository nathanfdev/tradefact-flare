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
  ModalBody,
  ModalFooter,
  Row,
  UncontrolledTooltip
} from 'reactstrap'
import { toast } from '../../../../helpers'
import { getNoOptionsMessage } from '../../../../helpers/dropdown-labels'
import { createOptions } from '../../../../helpers/dropdown-options'
import api from '../../../../packages/tradefact-api'
import {
  Address,
  Country,
  Directory
} from '../../../../packages/tradefact-objects'
import { DropdownOptionType } from '../../../../packages/tradefact-objects/dropdown-resource'
import {
  dropdownStyles,
  getDropdownBorderColor
} from '../../../../styles/dropdown-styles'
import { getValidations } from './validations'

interface CompanySetupModalProps {
  organisation: Directory
  onClose: () => void
}

const CompanySetupModal = ({
  organisation,
  onClose
}: CompanySetupModalProps) => {
  const [loading, setLoading] = useState(false)
  const [isValidCheck, setIsValidCheck] = useState(false)
  const [companyInfo, setCompanyInfo] = useState({
    taxId: '',
    companyAddress: {
      contactName: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      city: '',
      countryCode: '',
      county: '',
      postalCode: ''
    } as Address
  })
  const [countrySearch, setCountrySearch] = useState('')
  const [validationErrorCount, setValidationErrorCount] = useState(0)

  const { t } = useTranslation()

  const { taxId, companyAddress } = companyInfo

  const {
    addressNameValidation,
    addressLine1Validation,
    addressLine2Validation,
    addressLine3Validation,
    cityValidation,
    countryValidation,
    countyValidation,
    postcodeValidation,
    taxIdValidation
  } = getValidations(companyAddress, taxId)

  const countryBorderStyles = getDropdownBorderColor(
    isValidCheck && countryValidation.Valid,
    isValidCheck && !countryValidation.Valid
  )

  const countryDropdownStyles = {
    ...dropdownStyles,
    control: (provided: CSSProperties) => ({
      ...dropdownStyles.control(provided),
      ...countryBorderStyles
    })
  }

  const onSubmit = async () => {
    setIsValidCheck(true)

    if (isFormValid()) {
      setLoading(true)
      let orgDetails = organisation

      if (organisation.paymentTerms === 0) {
        orgDetails.paymentTerms = 1
      }

      const updateTaxIdAndCurrency = await api.updateCompany({
        ...orgDetails,
        taxId
      })

      const createCompanyAddress = await api.createCompanyInvoiceAddress({
        ...companyInfo.companyAddress
      })

      await Promise.all([updateTaxIdAndCurrency, createCompanyAddress])
        .then(() => {
          toast(t('company.toast.updatedSuccessMessage'), {
            title: t('company.toast.updatedTitle'),
            icon: 'success'
          })
        })
        .catch(() =>
          toast(t('validation.genericToastErrorMessage'), {
            title: t('generic.error'),
            icon: 'danger'
          })
        )
        .finally(() => {
          setLoading(false)
          onClose()
        })
    }
  }

  const handleChange = (key: string, value: string) => {
    setCompanyInfo(c => ({
      ...c,
      companyAddress: { ...c.companyAddress, [key]: value }
    }))
  }

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

  const updatedValidationErrorCount = [
    addressNameValidation.Valid,
    addressLine1Validation.Valid,
    addressLine2Validation.Valid,
    addressLine3Validation.Valid,
    cityValidation.Valid,
    countryValidation.Valid,
    countyValidation.Valid,
    postcodeValidation.Valid
  ].reduce((acc, value) => (value ? acc : ++acc), 0)

  const isFormValid = (): boolean => {
    setValidationErrorCount(updatedValidationErrorCount)
    return updatedValidationErrorCount === 0
  }

  useEffect(() => {
    if (isValidCheck && updatedValidationErrorCount === 0) {
      setValidationErrorCount(0)
    }
  }, [companyInfo])

  return (
    <div className='company-setup-modal'>
      <div className='modal-header'>
        <h5 className='modal-title'>{t('company.companySetup')}</h5>
      </div>
      <ModalBody>
        <Row>
          <Col
            xs={1}
            className='d-flex justify-content-center align-items-center p-0 header-icon-col'
          >
            <i className='fas fa-users-cog header-icon' />
          </Col>
          <Col className='d-flex flex-column align-items-start p-0'>
            <h6>{organisation.name}</h6>
            <p className='m-0'>{t('company.welcomeMessage')}</p>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <p className='sub-headings'>{t('company.companyAddress')}</p>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6}>
            <FormGroup>
              <Label className='quote-label'>
                {t('location.locationName')} {t('generic.optionalLabel')}
              </Label>{' '}
              <UncontrolledTooltip
                placement='right'
                target='location-name-icon'
              >
                {t('company.tooltip.locationName')}
              </UncontrolledTooltip>
              <i
                id='location-name-icon'
                className='far fa-exclamation-circle tooltip-icon'
              />
              <Input
                type='text'
                placeholder={`${t('location.locationName')}...`}
                id={'location-name'}
                name={'location-name'}
                value={companyAddress.contactName}
                onChange={e => handleChange('contactName', e.target.value)}
                invalid={isValidCheck && !addressNameValidation.Valid}
                valid={isValidCheck && addressNameValidation.Valid}
              />
              <FormFeedback tooltip>
                {addressNameValidation.Message}
              </FormFeedback>
            </FormGroup>
          </Col>
          <Col sm={12} md={6}>
            <FormGroup>
              <Label className='quote-label'>
                {t('location.addressLine1')}
              </Label>
              <Input
                type='text'
                placeholder={`${t('location.addressLine1')}...`}
                id={'address-line-1'}
                name={'address-line-1'}
                value={companyAddress.addressLine1}
                onChange={e => handleChange('addressLine1', e.target.value)}
                invalid={isValidCheck && !addressLine1Validation.Valid}
                valid={isValidCheck && addressLine1Validation.Valid}
              />
              <FormFeedback tooltip>
                {addressLine1Validation.Message}
              </FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6}>
            <FormGroup>
              <Label className='quote-label'>
                {t('location.addressLine2')} {t('generic.optionalLabel')}
              </Label>
              <Input
                type='text'
                placeholder={`${t('location.addressLine2')}...`}
                id={'address-line-2'}
                name={'address-line-2'}
                value={companyAddress.addressLine2}
                onChange={e => handleChange('addressLine2', e.target.value)}
                invalid={isValidCheck && !addressLine2Validation.Valid}
              />
              <FormFeedback tooltip>
                {addressLine2Validation.Message}
              </FormFeedback>
            </FormGroup>
          </Col>
          <Col sm={12} md={6}>
            <FormGroup>
              <Label className='quote-label'>
                {t('location.addressLine3')} {t('generic.optionalLabel')}
              </Label>
              <Input
                type='text'
                placeholder={`${t('location.addressLine3')}...`}
                id={'address-line-3'}
                name={'address-line-3'}
                value={companyAddress.addressLine3}
                onChange={e => handleChange('addressLine3', e.target.value)}
                invalid={isValidCheck && !addressLine3Validation.Valid}
              />
              <FormFeedback tooltip>
                {addressLine3Validation.Message}
              </FormFeedback>
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
                id='city'
                name='city'
                value={companyAddress.city}
                onChange={e => handleChange('city', e.target.value)}
                invalid={isValidCheck && !cityValidation.Valid}
                valid={isValidCheck && cityValidation.Valid}
              />
              <FormFeedback tooltip>{cityValidation.Message}</FormFeedback>
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
                placeholder={`${t('location.selectACountry')}...`}
                onChange={(option: ValueType<DropdownOptionType<Country>>) => {
                  handleChange(
                    'countryCode',
                    (option as DropdownOptionType<Country>)?.value?.code || ''
                  )
                  setCountrySearch(
                    (option as DropdownOptionType<Country>)?.label || ''
                  )
                }}
                onInputChange={(value, { action }) => {
                  if (action === 'input-change') {
                    handleChange('countryCode', '')
                    setCountrySearch(value)
                  }
                }}
                className='basic-single'
                classNamePrefix='select'
                isSearchable
                isClearable
              />

              {isValidCheck &&
                countrySearch === '' &&
                !countryValidation.Valid && <Input invalid hidden={true} />}
              <FormFeedback tooltip>{countryValidation.Message}</FormFeedback>
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
                id='county'
                name='county'
                value={companyAddress.county}
                onChange={e => handleChange('county', e.target.value)}
                invalid={isValidCheck && !countyValidation.Valid}
              />
              <FormFeedback tooltip>{countyValidation.Message}</FormFeedback>
            </FormGroup>
          </Col>
          <Col sm={12} md={6}>
            <FormGroup>
              <Label className='quote-label'>
                {t('location.postcodeLabel')}
              </Label>
              <Input
                type='text'
                placeholder={`${t('location.postcodeLabel')}...`}
                id='postalCode'
                name='postalCode'
                value={companyAddress.postalCode}
                onChange={e => handleChange('postalCode', e.target.value)}
                invalid={isValidCheck && !postcodeValidation.Valid}
              />
              <FormFeedback tooltip>{postcodeValidation.Message}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <p className='sub-headings'>
              {t('company.taxAndCurrencySubHeading')}
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label className='quote-label' for={taxId}>
                {t('company.taxID')} {t('generic.optionalLabel')}
              </Label>
              <Input
                id='tax-id'
                name='taxId'
                type='text'
                value={taxId}
                onChange={e => {
                  const { name, value } = e.target
                  setCompanyInfo(c => ({
                    ...c,
                    [name]: value
                  }))
                }}
                placeholder='Tax ID...'
                invalid={isValidCheck && !taxIdValidation}
              />
              <FormFeedback tooltip>{taxIdValidation.Message}</FormFeedback>
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
        <Button color='primary' onClick={onSubmit} disabled={loading}>
          {loading && (
            <span
              className='spinner-border spinner-border-sm mr-2'
              role='status'
              aria-hidden='true'
            ></span>
          )}
          {t('generic.save')}
        </Button>
      </ModalFooter>
    </div>
  )
}

export default CompanySetupModal
