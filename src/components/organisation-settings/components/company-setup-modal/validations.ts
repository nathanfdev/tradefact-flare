import {
  checkForValidAddress1,
  isValueEmpty,
  minMaxEmptyCharCheck
} from '../../../../helpers/validations/validations'
import { Address } from '../../../../packages/tradefact-objects'
import { useTranslation } from 'react-i18next'

export const getValidations = (companyAddress: Address, taxId: string) => {
  const { t } = useTranslation()
  const addressNameValidation = minMaxEmptyCharCheck(
    3,
    100,
    companyAddress.contactName,
    t('postcodeLabel'),
    true
  )

  const addressLine1Validation = checkForValidAddress1(
    1,
    100,
    companyAddress.addressLine1,
    t('addressLine1'),
    true
  )

  const addressLine2Validation = minMaxEmptyCharCheck(
    0,
    100,
    companyAddress.addressLine2,
    t('addressLine2'),
    false
  )

  const addressLine3Validation = minMaxEmptyCharCheck(
    0,
    100,
    companyAddress.addressLine3,
    t('addressLine3'),
    false
  )

  const cityValidation = minMaxEmptyCharCheck(
    3,
    100,
    companyAddress.city,
    t('city'),
    true
  )

  const countryValidation = isValueEmpty(companyAddress.countryCode, 'Country')

  const countyValidation = minMaxEmptyCharCheck(
    0,
    100,
    companyAddress.county,
    t('countyLabel'),
    false
  )

  const postcodeValidation = minMaxEmptyCharCheck(
    0,
    15,
    companyAddress.postalCode,
    t('postcodeLabel'),
    false
  )

  const taxIdValidation = minMaxEmptyCharCheck(5, 25, taxId, 'Tax ID', true)

  return {
    addressNameValidation,
    addressLine1Validation,
    addressLine2Validation,
    addressLine3Validation,
    cityValidation,
    countryValidation,
    countyValidation,
    postcodeValidation,
    taxIdValidation
  }
}
