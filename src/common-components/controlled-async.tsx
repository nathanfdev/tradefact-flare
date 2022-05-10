import React, { useCallback } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { FormFeedback, FormGroup, Label } from 'reactstrap'
import AsyncSelect from 'react-select/async'
import { get, debounce } from 'lodash'
import { Styles } from 'react-select'
import { getListCountries } from '../packages/tradefact-api/country'
import { useTranslation } from 'react-i18next'

export default function ControlledAsync({
  name,
  label,
  rules,
  placeholder,
  onChange,
  value,
  styles,
  loadOptions,
  defaultValue,
  formatOptionLabel,
  preset,
  triggerOnChange = true,
  shouldUnregister = false
}: {
  name: string
  label?: string
  rules?: any
  placeholder?: string
  styles?: Partial<Styles> | undefined
  onChange?: any
  triggerOnChange?: boolean
  value?: any | null | ''
  defaultValue?: any
  loadOptions?: any
  preset?: 'country'
  shouldUnregister?: boolean
  formatOptionLabel?: (option: any) => React.ReactNode
}) {
  const { trigger, control, formState } = useFormContext()
  const { t } = useTranslation()

  if (preset == 'country') {
    loadOptions = getListCountries
    shouldUnregister = true
  }

  const debouncedLoadOptions = useCallback(
    debounce(loadOptions, 300, {
      leading: true
    }),
    []
  )

  return (
    <FormGroup className='m-0'>
      {label && <Label>{label}</Label>}
      <Controller
        name={name}
        shouldUnregister={shouldUnregister}
        control={control}
        rules={rules}
        render={({ field }) => (
          <AsyncSelect
            {...field}
            placeholder={placeholder}
            isClearable
            isSearchable={true}
            value={value === '' ? null : value}
            styles={styles}
            noOptionsMessage={({ inputValue }) =>
              !inputValue ? t('generic.noOptions') : inputValue
            }
            defaultOptions={true}
            defaultValue={defaultValue}
            loadOptions={debouncedLoadOptions}
            onChange={e => {
              field.onChange(e)
              onChange(e)
              if (triggerOnChange) trigger(name)
            }}
            formatOptionLabel={formatOptionLabel}
          />
        )}
      />
      {get(formState.errors, name) && (
        <FormFeedback style={{ display: 'inline-block' }} tooltip>
          {get(formState.errors, `${name}.message`)}
        </FormFeedback>
      )}
    </FormGroup>
  )
}
