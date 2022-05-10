import { ShipmentType } from '../../packages/tradefact-objects'
import {
  checkType,
  compareDates,
  duplicateSkuCheck,
  getNumberFormatValidClassName,
  isDateInFuture,
  isDateInPast,
  isEmailValid,
  isNumbersAndLetters,
  isOnlyLetters,
  isOnlyNumbers,
  isValueEmpty,
  maxCharLength,
  minCharLength,
  minMaxNumberAndLetters
} from './validations'

describe('Validation function tests', () => {
  const validOutput = { Valid: true, Message: 'Valid' }

  it('it should say that value input is valid', () => {
    expect(isValueEmpty(1, 'Field')).toEqual(validOutput)
  })

  it('it should say that value input is undefined/empty', () => {
    const output = { Valid: false, Message: 'Field is required' }
    expect(isValueEmpty(undefined, 'Field')).toEqual(output)
  })

  it('it should say that email input is valid', () => {
    expect(isEmailValid('name@domain.com', true)).toEqual(validOutput)
  })

  it('it should say that email input is required', () => {
    const output = { Valid: false, Message: 'Email is required' }
    expect(isEmailValid('', true)).toEqual(output)
  })

  it('it should say that email input is invalid', () => {
    const output = { Valid: false, Message: 'Email must be in a valid format' }
    expect(isEmailValid('name@domain', true)).toEqual(output)
  })

  it('it should say that number input is valid', () => {
    expect(isOnlyNumbers('1234', 'Field', true)).toEqual(validOutput)
  })

  it('it should say that number input is required', () => {
    const output = { Valid: false, Message: 'Field is required' }
    expect(isOnlyNumbers('', 'Field', true)).toEqual(output)
  })

  it('it should say that number input is invalid', () => {
    const output = { Valid: false, Message: 'Field must only contain numbers' }
    expect(isOnlyNumbers('123abc', 'Field', true)).toEqual(output)
  })

  it('it should say that letter input is valid', () => {
    expect(isOnlyLetters('abcde', 'Field', true)).toEqual(validOutput)
  })

  it('it should say that letter input is required', () => {
    const output = { Valid: false, Message: 'Field is required' }
    expect(isOnlyLetters('', 'Field', true)).toEqual(output)
  })

  it('it should say that letter input is invalid', () => {
    const output = { Valid: false, Message: 'Field must only contain letters' }
    expect(isOnlyLetters('123abc', 'Field', true)).toEqual(output)
  })

  it('it should say that letter and number input is valid', () => {
    expect(isNumbersAndLetters('abc123', 'Field', true)).toEqual(validOutput)
  })

  it('it should say that letter and number input is required', () => {
    const output = { Valid: false, Message: 'Field is required' }
    expect(isNumbersAndLetters('', 'Field', true)).toEqual(output)
  })

  it('it should say that letter and number input is invalid', () => {
    const output = {
      Valid: false,
      Message: 'Field must only contain letters and numbers'
    }
    expect(isNumbersAndLetters('123abc!*', 'Field', true)).toEqual(output)
  })

  it('it should say that input is valid and within min/max char limit', () => {
    expect(minMaxNumberAndLetters(3, 6, 'sample', 'Field', true)).toEqual(
      validOutput
    )
  })

  it('it should say that min/max char limit input is required', () => {
    const output = { Valid: false, Message: 'Field is required' }
    expect(minMaxNumberAndLetters(3, 6, '', 'Field', true)).toEqual(output)
  })

  it('it should say that min/max char input is too short and invalid', () => {
    const output = {
      Valid: false,
      Message: 'Field must be at least 3 characters'
    }
    expect(minMaxNumberAndLetters(3, 6, 'sa', 'Field', true)).toEqual(output)
  })

  it('it should say that min/max char input is too long and invalid', () => {
    const output = {
      Valid: false,
      Message: 'Field must be at most 6 characters'
    }
    expect(minMaxNumberAndLetters(3, 6, 'sampleSample', 'Field', true)).toEqual(
      output
    )
  })

  it('it should say that min/max char input has non-letter/number chars and invalid', () => {
    const output = {
      Valid: false,
      Message: 'Field must only contain letters and numbers'
    }
    expect(minMaxNumberAndLetters(3, 6, 'samp!', 'Field', true)).toEqual(output)
  })

  it('it should say that min/max char input is required', () => {
    const output = {
      Valid: false,
      Message: 'Field is required'
    }
    expect(minMaxNumberAndLetters(3, 6, '', 'Field', true)).toEqual(output)
  })

  it('it should say that min char limit input is valid', () => {
    expect(minCharLength(3, 'sample', 'Field', true)).toEqual(validOutput)
  })

  it('it should say that min char input is too short and invalid', () => {
    const output = {
      Valid: false,
      Message: 'Field must be at least 3 characters'
    }
    expect(minCharLength(3, 'sa', 'Field', true)).toEqual(output)
  })

  it('it should say that min char input is required', () => {
    const output = {
      Valid: false,
      Message: 'Field is required'
    }
    expect(minCharLength(3, '', 'Field', true)).toEqual(output)
  })

  it('it should say that max char limit input is valid', () => {
    expect(maxCharLength(6, 'sample', 'Field', true)).toEqual(validOutput)
  })

  it('it should say that max char input is too long and invalid', () => {
    const output = {
      Valid: false,
      Message: 'Field must be at most 6 characters'
    }
    expect(maxCharLength(6, 'sampleSample', 'Field', true)).toEqual(output)
  })

  it('it should say that max char input is required', () => {
    const output = {
      Valid: false,
      Message: 'Field is required'
    }
    expect(maxCharLength(6, '', 'Field', true)).toEqual(output)
  })

  it('it should say that SKU input is valid', () => {
    expect(
      duplicateSkuCheck(3, 20, 'sampleSku123', 'sampleSku345', 'Field', true)
    ).toEqual(validOutput)
  })

  it('it should say that SKU input is invalid and duplicated', () => {
    const output = {
      Valid: false,
      Message: 'SKU must be different from original product'
    }
    expect(
      duplicateSkuCheck(3, 20, 'sampleSku123', 'sampleSku123', 'Field', true)
    ).toEqual(output)
  })

  it('it should say that date input is valid and not in past', () => {
    expect(isDateInPast('01-01-2050', 'Field', true)).toEqual(validOutput)
  })

  it('it should say that date input is in past and invalid', () => {
    const output = {
      Valid: false,
      Message: 'Field cannot be in the past'
    }
    expect(isDateInPast('01-01-2020', 'Field', true)).toEqual(output)
  })

  it('it should say that date input is required', () => {
    const output = {
      Valid: false,
      Message: 'Field is required'
    }
    expect(isDateInPast('', 'Field', true)).toEqual(output)
  })

  it('it should say that date input is valid and in future', () => {
    expect(isDateInFuture('01-01-2050', 'Field', true)).toEqual(validOutput)
  })

  it('it should say that date input is too far in future and invalid', () => {
    const output = {
      Valid: false,
      Message: 'Field is not valid'
    }
    expect(isDateInFuture('01-01-3000', 'Field', true)).toEqual(output)
  })

  it('it should say that date input is required', () => {
    const output = {
      Valid: false,
      Message: 'Field is required'
    }
    expect(isDateInFuture('', 'Field', true)).toEqual(output)
  })

  it('it should say that both date inputs are valid', () => {
    expect(
      compareDates(
        '01-01-2025',
        'Date 1',
        '01-12-2025',
        'Date 2',
        false,
        false,
        true
      )
    ).toEqual(validOutput)
  })

  it('it should say that both dates on same day inputs are valid', () => {
    expect(
      compareDates(
        '01-01-2025',
        'Date 1',
        '01-01-2025',
        'Date 2',
        true,
        false,
        true
      )
    ).toEqual(validOutput)
  })

  it('it should say that dates are invalid as second date before first, today excluded', () => {
    const output = {
      Valid: false,
      Message: 'Date 2 must not be on or before Date 1'
    }
    expect(
      compareDates(
        '01-02-2025',
        'Date 1',
        '01-01-2025',
        'Date 2',
        false,
        false,
        true
      )
    ).toEqual(output)
  })

  it('it should say that dates are invalid as second date before first, today included', () => {
    const output = {
      Valid: false,
      Message: 'Date 2 must not be before Date 1'
    }
    expect(
      compareDates(
        '01-02-2025',
        'Date 1',
        '01-01-2025',
        'Date 2',
        true,
        false,
        true
      )
    ).toEqual(output)
  })

  it('it should say that dates are invalid as first date is required', () => {
    const output = {
      Valid: false,
      Message: 'Date 1 is required'
    }
    expect(
      compareDates('', 'Date 1', '01-01-2025', 'Date 2', true, false, true)
    ).toEqual(output)
  })

  it('it should say that type input is valid', () => {
    expect(checkType(1, 'Sample Type', ShipmentType)).toEqual(validOutput)
  })

  it('it should say that type input is invalid', () => {
    const output = {
      Valid: false,
      Message: 'You must select a Sample Type'
    }
    expect(checkType(-1, 'Sample Type', ShipmentType)).toEqual(output)
  })

  it('it should return normal form control CSS', () => {
    const inputCheck = {
      Valid: false,
      Message: 'Error msg'
    }
    const output = 'form-control'
    expect(getNumberFormatValidClassName(inputCheck, false)).toEqual(output)
  })

  it('it should return invalid form control CSS', () => {
    const inputCheck = {
      Valid: false,
      Message: 'Error msg'
    }
    const output = 'form-control invalid-number-format'
    expect(getNumberFormatValidClassName(inputCheck, true)).toEqual(output)
  })
})
