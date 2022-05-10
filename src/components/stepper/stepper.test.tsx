import { render } from '@testing-library/react'
import React from 'react'
import Stepper from '.'

describe('<Stepper />', () => {
  it('should render with no steps', () => {
    expect(() => render(<Stepper steps={[]} />)).not.toThrow()
  })

  it('should render with steps', () => {
    const onClick = jest.fn()
    expect(() =>
      render(<Stepper steps={[{ active: true, title: 'Test', onClick }]} />)
    ).not.toThrow()
  })
})
