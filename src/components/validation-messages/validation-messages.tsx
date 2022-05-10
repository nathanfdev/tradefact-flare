import React from 'react'
import { FormFeedback, Input } from 'reactstrap'
interface HiddenValidationInputProps {
  isValidCheck: boolean
  isInvalid: boolean
  message: string
}

export const HiddenValidationInput = ({
  isValidCheck,
  isInvalid,
  message
}: HiddenValidationInputProps) => {
  return (
    <>
      {isValidCheck && isInvalid && <Input hidden invalid />}
      <FormFeedback tooltip>{message}</FormFeedback>
    </>
  )
}
