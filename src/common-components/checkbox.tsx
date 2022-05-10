import React from 'react'
import { FormGroup, Input, Label } from 'reactstrap'

interface CheckboxProps {
  id: string
  checked: boolean
  labelText: string
  readOnly?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const Checkbox = ({
  id,
  checked,
  labelText,
  readOnly,
  onChange
}: CheckboxProps) => {
  return (
    <FormGroup check>
      <Label check>
        <Input
          id={id}
          type='checkbox'
          checked={checked}
          onChange={onChange ?? undefined}
          role='checkbox'
          readOnly={readOnly ? readOnly : false}
        />{' '}
        {labelText}
      </Label>
    </FormGroup>
  )
}

export default Checkbox
