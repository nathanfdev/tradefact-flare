import React from 'react'
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap'
import { useController, useFormContext } from 'react-hook-form'
import { get } from 'lodash'
import { InputType } from 'reactstrap/lib/Input'

export function ControlledInput({
  label,
  name,
  rules,
  type = 'text',
  placeholder,
  triggerOnChange = true
}: {
  label: string
  name: string
  rules?: any
  type?: InputType | undefined
  placeholder?: string
  triggerOnChange?: boolean
}) {
  const { trigger, control } = useFormContext()

  const {
    field: { onChange, onBlur, value, ref },
    formState: { errors }
  } = useController({
    name,
    control,
    rules
  })

  return (
    <FormGroup className='m-0'>
      <Label>{label}</Label>
      <Input
        style={{ height: '38px' }}
        placeholder={placeholder || label}
        type={type}
        onChange={e => {
          onChange(e)
          if (triggerOnChange) trigger(name)
        }} // send value to hook form
        onBlur={onBlur} // notify when input is touched/blur
        value={value} // input value
        name={name} // send down the input name
        inputRef={ref} // send input ref, so we can focus on input when error appear
        invalid={get(errors, name)}
      />
      <FormFeedback tooltip>
        <div
          // https://stackoverflow.com/questions/16038458/html-tags-in-i18next-translation
          dangerouslySetInnerHTML={{ __html: get(errors, `${name}.message`) }}
        ></div>
      </FormFeedback>
    </FormGroup>
  )
}
