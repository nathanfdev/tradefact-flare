import { render } from '@testing-library/react'
import React from 'react'
import Router from '.'

describe('<Router />', () => {
  it('should render', () => {
    expect(() => render(<Router />)).not.toThrow()
  })
})
