import React from 'react'
import { FormFeedback, FormGroup, Label } from 'reactstrap'
import { Controller, useController, useFormContext } from 'react-hook-form'
import { get } from 'lodash'
import ReactDatePicker from 'react-datepicker'

export function ControlledDatepicker({
  label,
  name,
  rules,
  minDate,
  placeholder
}: {
  label: string
  name: string
  rules?: any
  placeholder?: string
  minDate: string
}) {
  const { trigger, control } = useFormContext()
  const {
    formState: { errors }
  } = useController({
    name,
    control,
    rules
  })

  const CustomInput = React.forwardRef<
    HTMLInputElement,
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >
  >((props, ref) => (
    <div>
      <input ref={ref} {...props} />
    </div>
  ))

  CustomInput.displayName = 'CustomInput'

  const addMonths = (months: number) => {
    const date = new Date()
    return new Date(date.setMonth(date.getMonth() + months))
  }

  const addDaysToDate = (dateString: string, days: number) => {
    const date = new Date(dateString)
    date.setDate(date.getDate() + days)
    return date
  }

  const locale = window.navigator.language

  return (
    <FormGroup
      className='m-0'
      onKeyDown={event => {
        // Prevent alphabet charactors
        if (event.key.match(/[a-zA-Z]/)) {
          event.preventDefault()
        }
      }}
    >
      <Label>{label}</Label>
      <Controller
        name={name}
        control={control}
        defaultValue={null}
        rules={rules}
        render={({ field: { onChange, value } }) => {
          return (
            <ReactDatePicker
              onChange={e => {
                onChange(e)
                trigger(name)
              }}
              selected={value}
              dateFormat={locale === 'en-US' ? 'MM/dd/yyyy' : 'dd/MM/yyyy'}
              minDate={addDaysToDate(minDate, 1)}
              maxDate={addMonths(2)}
              showDisabledMonthNavigation
              placeholderText={placeholder}
              customInput={
                <CustomInput
                  style={
                    get(errors, `${name}`)
                      ? { height: '38px', borderColor: '#e66054' }
                      : { height: '38px' }
                  }
                  className='form-control'
                />
              }
            />
          )
        }}
      />
      {get(errors, `${name}`) && (
        <FormFeedback style={{ display: 'inline-block' }} tooltip>
          {get(errors, `${name}.message`)}
        </FormFeedback>
      )}
    </FormGroup>
  )
}
