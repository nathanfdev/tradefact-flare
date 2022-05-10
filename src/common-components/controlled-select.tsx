import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import Select from 'react-select'
import { FormFeedback, FormGroup, Label } from 'reactstrap'
import {
  dropdownStyles,
  invalidDropdownStyles
} from '../styles/dropdown-styles'
import { get } from 'lodash'

export default function ControlledSelect({
  label,
  options,
  rules,
  name,
  placeholder,
  triggerOnChange = true
}: {
  label: string
  name: string
  options: any
  rules?: any
  placeholder?: string
  triggerOnChange?: boolean
}) {
  const {
    trigger,
    control,
    formState: { errors }
  } = useFormContext()

  return (
    <FormGroup className='m-0'>
      {label && <Label>{label}</Label>}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <Select
            {...field}
            defaultValue={null}
            placeholder={placeholder || label}
            styles={
              get(errors, `${name}`) ? invalidDropdownStyles : dropdownStyles
            }
            onChange={e => {
              field.onChange(e)
              if (triggerOnChange) {
                trigger(name)
              }
            }}
            isClearable
            options={options}
          />
        )}
      />
      {get(errors, `${name}`) && (
        <FormFeedback style={{ display: 'inline-block' }} tooltip>
          {get(errors, `${name}.message`)}
        </FormFeedback>
      )}
    </FormGroup>
  )
}
