import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import LoginModal from '.'

describe('<LoginModal />', () => {
  it('should render', () => {
    const onToggle = jest.fn()
    expect(() =>
      render(<LoginModal isOpen={true} onToggle={onToggle} />)
    ).not.toThrow()
  })

  it('should update the email when the input changes', () => {
    const onToggle = jest.fn()
    const { getByPlaceholderText } = render(
      <LoginModal isOpen={true} onToggle={onToggle} />
    )

    fireEvent.change(getByPlaceholderText('Email address'), {
      target: { value: 'Hello World!' }
    })

    expect(getByPlaceholderText('Email address')).toHaveValue('Hello World!')
  })

  it('should update the password when the input changes', () => {
    const onToggle = jest.fn()
    const { getByPlaceholderText } = render(
      <LoginModal isOpen={true} onToggle={onToggle} />
    )

    fireEvent.change(getByPlaceholderText('Password'), {
      target: { value: 'Hello World!' }
    })

    expect(getByPlaceholderText('Password')).toHaveValue('Hello World!')
  })
})
