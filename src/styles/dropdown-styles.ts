import { CSSProperties } from 'react'
import { ValidationResult } from '../helpers/validations/validations'
import { borderColor } from './validation-styles'

export const DETAILED_DROPDOWN_MAX_HEIGHT = 270
export const SIMPLE_DROPDOWN_MAX_HEIGHT = 290
const {
  VALID,
  VALID_ON_HOVER,
  INVALID,
  INVALID_ON_HOVER,
  DEFAULT,
  DEFAULT_ON_HOVER
} = borderColor

interface BorderColorOnHover {
  borderColor: string
}
export interface DropdownBorders {
  borderColor: string
  ':hover': BorderColorOnHover
  boxShadow?: string
}

export const dropdownStyles = {
  option: (provided: any) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    fontFamily: '"Inter",sans-serif',
    color: 'black',
    zIndex: '10',
    whiteSpace: 'nowrap',
    lineHeight: '1',
    borderBottom: 'solid 1px #d4deec'
  }),
  input: (provided: any) => ({
    ...provided,
    lineHeight: '1',
    borderColor: '#d4deec',
    fontSize: '13px'
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#95AAC9',
    fontSize: '14px'
  }),
  control: (provided: any) => ({
    // none of react-select's styles are passed to <Control />
    ...provided,
    lineHeight: '1',
    borderColor: '#d4deec',
    backgroundColor: 'white',
    '&:hover': {
      borderColor: '#9ec2f3'
    }
  }),
  menuList: (provided: any) => ({
    ...provided
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: '99'
  }),
  singleValue: (provided: any) => {
    return { ...provided, color: 'black', fontSize: '14px', lineHeight: 2 }
  },
  noOptionsMessage: (provided: any) => ({
    ...provided,
    color: 'black'
  })
}

export const invalidDropdownStyles = {
  ...dropdownStyles,
  control: (provided: CSSProperties) => ({
    ...dropdownStyles.control(provided),
    boxShadow: '0 0 0 1px #e66054',
    border: 'none'
  })
}

export const countryDropdownStyles = {
  ...dropdownStyles,
  control: (provided: CSSProperties) => ({
    ...dropdownStyles.control(provided)
  }),
  menu: (provided: CSSProperties) => ({
    ...dropdownStyles.menu(provided)
    // width: '300px'
  }),
  menuList: (provided: CSSProperties) => ({
    ...dropdownStyles.menuList(provided)
  })
}

export const locationDropdownStyles = {
  ...dropdownStyles,
  option: (provided: CSSProperties) => ({
    ...dropdownStyles.option(provided),
    backgroundColor: 'white'
  })
}

export const getDropdownBorderColor = (
  validSelection: boolean,
  invalidSelection: boolean
) => {
  if (validSelection) {
    return {
      borderColor: VALID,
      boxShadow: 'none',
      ':hover': {
        borderColor: VALID_ON_HOVER
      }
    }
  } else if (invalidSelection) {
    return {
      borderColor: INVALID,
      boxShadow: 'none',
      ':hover': {
        borderColor: INVALID_ON_HOVER
      }
    }
  } else {
    return {
      borderColor: DEFAULT,
      ':hover': {
        borderColor: DEFAULT_ON_HOVER
      }
    }
  }
}

export const getDropdownStyles = (
  isValidCheck: boolean,
  validationCheck: ValidationResult
) => {
  const valid = isValidCheck && validationCheck.Valid
  const invalid = isValidCheck && !validationCheck.Valid
  const borderStyles = getDropdownBorderColor(valid, invalid)

  return {
    ...dropdownStyles,
    control: (provided: CSSProperties) => ({
      ...dropdownStyles.control(provided),
      ...borderStyles
    })
  }
}
