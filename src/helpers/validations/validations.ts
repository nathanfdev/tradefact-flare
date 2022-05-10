import { t } from 'i18next'
import moment from 'moment'

export interface ValidationResult {
  Valid: boolean
  Message: string
}

const yesterday = moment()
  .subtract(1, 'days')
  .toDate()

const getIsRequiredMessage = (value: string) =>
  t('validation.validationRequiredMessage', { value })

export const isValueEmpty = (
  value: any,
  valueName: string
): ValidationResult => {
  if (!value) {
    return {
      Valid: false,
      Message: getIsRequiredMessage(valueName)
    }
  } else if (value <= 0) {
    return { Valid: false, Message: getIsRequiredMessage(valueName) }
  }
  return { Valid: true, Message: 'Valid' }
}

export const isEmailValid = (
  email: string,
  required: boolean
): ValidationResult => {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,63}$/

  if (!email && !required) {
    return { Valid: true, Message: t('valid') }
  }

  if (required && !email) {
    return { Valid: false, Message: getIsRequiredMessage('Email') }
  } else {
    if (!emailRegex.test(email)) {
      return { Valid: false, Message: t('validation.emailValidFormatMessage') }
    } else {
      return { Valid: true, Message: t('valid') }
    }
  }
}

export const isOnlyNumbers = (
  number: string,
  valueName: string,
  required: boolean
): ValidationResult => {
  const onlyNumberRegex = /^\d+$/
  if (!number && !required) {
    return { Valid: true, Message: t('valid') }
  }

  if (required && !number) {
    return { Valid: false, Message: getIsRequiredMessage(valueName) }
  } else {
    if (!onlyNumberRegex.test(number)) {
      return {
        Valid: false,
        Message: `${valueName} ${t('validation.mustOnlyContainNumbers')}`
      }
    } else {
      return { Valid: true, Message: t('valid') }
    }
  }
}

export const isOnlyLetters = (
  value: string,
  valueName: string,
  required: boolean
): ValidationResult => {
  const onlyNumberRegex = /^[a-zA-Z]+(\s{0,1}[a-zA-Z ])*$/
  if (!value && !required) {
    return { Valid: true, Message: t('valid') }
  }

  if (required && !value) {
    return { Valid: false, Message: getIsRequiredMessage(valueName) }
  } else {
    if (!onlyNumberRegex.test(value)) {
      return {
        Valid: false,
        Message: `${valueName} ${t('valdation.mustOnlyContainLetters')}`
      }
    } else {
      return { Valid: true, Message: t('valid') }
    }
  }
}

export const isNumbersAndLetters = (
  value: string,
  valueName: string,
  required: boolean
): ValidationResult => {
  const onlyNumberRegex = /^[0-9a-zA-Z]+$/
  if (!value && !required) {
    return { Valid: true, Message: t('valid') }
  }

  if (required && !value) {
    return { Valid: false, Message: getIsRequiredMessage(valueName) }
  } else {
    if (!onlyNumberRegex.test(value)) {
      return {
        Valid: false,
        Message: `${valueName} ${t(
          'valdation.mustOnlyContainLettersAndNumbers'
        )}`
      }
    } else {
      return { Valid: true, Message: t('valid') }
    }
  }
}

export const checkForValidAddress1 = (
  min: number,
  max: number,
  value: any,
  valueName: string,
  required: boolean
): ValidationResult => {
  if (
    required &&
    value.length === 1 &&
    valueName.toLowerCase().includes('address line 1')
  ) {
    value = value.replace(/[^\w]|_/g, '')
    if (!value) {
      return {
        Valid: false,
        Message: t('validation.isNotValid', { value: valueName })
      }
    }
  }
  return minMaxEmptyCharCheck(min, max, value, valueName, required)
}

export const minMaxNumberAndLetters = (
  min: number,
  limit: number,
  value: string,
  valueName: string,
  required: boolean
): ValidationResult => {
  const onlyNumberRegex = /^[0-9a-zA-Z]+$/
  if (required && !value) {
    return { Valid: false, Message: getIsRequiredMessage(valueName) }
  } else {
    if (value.length > limit) {
      return {
        Valid: false,
        Message: t('validation.maxLimitCharactersMessage', {
          value: valueName,
          limit
        })
      }
    }
    if (value.length < min) {
      return {
        Valid: false,
        Message: t('validation.minLimitCharactersMessage', {
          value: valueName,
          limit: min
        })
      }
    } else {
      if (!onlyNumberRegex.test(value)) {
        return {
          Valid: false,
          Message: `${valueName} ${t(
            'validation.mustOnlyContainLettersAndNumbers'
          )}`
        }
      } else {
        return { Valid: true, Message: t('valid') }
      }
    }
  }
}

export const minCharLength = (
  limit: number,
  value: any,
  valueName: string,
  required: boolean
): ValidationResult => {
  if (!value && !required) {
    return { Valid: true, Message: t('valid') }
  }

  if (required && !value) {
    return { Valid: false, Message: getIsRequiredMessage(valueName) }
  } else {
    if (value.length < limit) {
      return {
        Valid: false,
        Message: t('validation.minLimitCharactersMessage', {
          value: valueName,
          limit
        })
      }
    } else {
      return { Valid: true, Message: t('valid') }
    }
  }
}

export const maxCharLength = (
  limit: number,
  value: any,
  valueName: string,
  required: boolean
): ValidationResult => {
  if (!value && !required) {
    return { Valid: true, Message: t('valid') }
  }

  if (required && !value) {
    return { Valid: false, Message: getIsRequiredMessage(valueName) }
  } else {
    if (value.length > limit) {
      return {
        Valid: false,
        Message: t('validation.maxLimitCharactersMessage', {
          value: valueName,
          limit
        })
      }
    } else {
      return { Valid: true, Message: t('valid') }
    }
  }
}

export const minMaxEmptyCharCheck = (
  min: number,
  max: number,
  value: any,
  valueName: string,
  required: boolean
): ValidationResult => {
  if (!value && !required) {
    return { Valid: true, Message: t('valid') }
  }

  if (required && !value) {
    return { Valid: false, Message: getIsRequiredMessage(valueName) }
  } else {
    if (!minCharLength(min, value, valueName, required).Valid) {
      return minCharLength(min, value, valueName, required)
    }
    if (!maxCharLength(max, value, valueName, required).Valid) {
      return maxCharLength(max, value, valueName, required)
    } else {
      return { Valid: true, Message: t('valid') }
    }
  }
}

export const duplicateSkuCheck = (
  min: number,
  max: number,
  value: any,
  duplicateSku: any,
  valueName: string,
  required: boolean
): ValidationResult => {
  if (required && !value) {
    return { Valid: false, Message: getIsRequiredMessage(valueName) }
  } else {
    if (duplicateSku && duplicateSku === value) {
      return {
        Valid: false,
        Message: t('validation.skuMustBeDifferentMessage')
      }
    }
    if (!minCharLength(min, value, valueName, required).Valid) {
      return minCharLength(min, value, valueName, required)
    }
    if (!maxCharLength(max, value, valueName, required).Valid) {
      return maxCharLength(max, value, valueName, required)
    } else {
      return { Valid: true, Message: t('valid') }
    }
  }
}

export const isDateInPast = (
  value: string,
  valueName: string,
  required: boolean
): ValidationResult => {
  if (!value && !required) {
    return { Valid: true, Message: t('valid') }
  }

  if (required && !value) {
    return { Valid: false, Message: getIsRequiredMessage(valueName) }
  } else {
    if (moment(value).isBefore(yesterday)) {
      return {
        Valid: false,
        Message: t('validation.dateCannotBeInPast', { value: valueName })
      }
    } else {
      return { Valid: true, Message: t('valid') }
    }
  }
}

export const isDateInFuture = (
  date: string,
  dateValue: string,
  required: boolean
): ValidationResult => {
  if (!date && !required) {
    return { Valid: true, Message: t('valid') }
  }

  if (required && !date) {
    return { Valid: false, Message: getIsRequiredMessage(dateValue) }
  } else {
    if (moment(date).isAfter('2099/01/01')) {
      return {
        Valid: false,
        Message: t('validation.isNotValid', { value: dateValue })
      }
    } else {
      return { Valid: true, Message: t('valid') }
    }
  }
}

export const isDateInPastAndFuture = (
  date: string,
  dateName: string,
  required = true
): ValidationResult => {
  const pastDate = isDateInPast(date, dateName, required)

  const futureDate = isDateInFuture(date, dateName, required)

  if (!pastDate.Valid) {
    return pastDate
  }

  if (!futureDate.Valid) {
    return futureDate
  }

  return { Valid: true, Message: t('valid') }
}

export const compareDates = (
  date1: string,
  date1Value: string,
  date2: string,
  date2Value: string,
  includeToday: boolean,
  pastAllowed: boolean,
  required: boolean
): ValidationResult => {
  if ((required && !date1) || !date2) {
    if (!date2) {
      return { Valid: false, Message: getIsRequiredMessage(date2Value) }
    } else {
      return { Valid: false, Message: getIsRequiredMessage(date1Value) }
    }
  } else {
    if (date1 && date2) {
      if (
        moment(date1).isAfter('2099/01/01') ||
        moment(date2).isAfter('2099/01/01')
      ) {
        return {
          Valid: false,
          Message: t('validation.datesAreNotValid')
        }
      }
      if (!pastAllowed && !isDateInPast(date2, date2Value, true).Valid) {
        return isDateInPast(date2, date2Value, true)
      }
      if (includeToday && moment(date1).isSame(date2)) {
        return { Valid: true, Message: t('valid') }
      } else {
        if (!moment(date1).isBefore(date2)) {
          return {
            Valid: false,
            Message: includeToday
              ? t('validation.dateMustNotBeBefore', {
                  date1: date1Value,
                  date2: date2Value
                })
              : t('validation.dateMustNotBeOnOrBefore', {
                  date1: date1Value,
                  date2: date2Value
                })
          }
        } else {
          return { Valid: true, Message: t('valid') }
        }
      }
    } else {
      return { Valid: true, Message: t('valid') }
    }
  }
}

export const checkType = <T>(
  value: number,
  valueName: string,
  enums: T
): ValidationResult => {
  if (!Object.values(enums).includes(value)) {
    return {
      Valid: false,
      Message: t('validation.checkTypeValidationMessage', { value: valueName })
    }
  } else {
    return { Valid: true, Message: t('valid') }
  }
}

export const getNumberFormatValidClassName = (
  check: ValidationResult,
  isValidCheck: boolean
) => {
  if (!isValidCheck) {
    return 'form-control'
  }

  return check.Valid
    ? 'form-control valid-number-format'
    : 'form-control invalid-number-format'
}

export const hsCodeCheck = (
  hsCode: string,
  required: boolean
): ValidationResult => {
  if (!hsCode && !required) {
    return { Valid: true, Message: t('valid') }
  }
  const onlyNumberRegex = /^[0-9\b]+$/
  if (
    hsCode.length > 10 ||
    hsCode.length < 6 ||
    !onlyNumberRegex.test(hsCode)
  ) {
    return {
      Valid: false,
      Message: t('validation.hsCodeValidationMessage')
    }
  }
  return { Valid: true, Message: t('valid') }
}

export const handleKeyDown = (e: any) => {
  let startPos = e.currentTarget.selectionStart
  if (startPos === 0 && e.keyCode === 32) {
    e.preventDefault()
  }
}
