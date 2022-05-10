import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import SearchBar from '.'

describe('<SearchBar />', () => {
  it('should render', () => {
    expect(() => render(<SearchBar searchFunction={x => x} />)).not.toThrow()
  })

  it('should update the search box when the input changes', () => {
    const doSearch = jest.fn()
    const { getByTestId } = render(
      <SearchBar searchFunction={x => doSearch(x)} />
    )

    fireEvent.change(getByTestId('searchbar'), {
      target: { value: 'search term' }
    })

    expect(getByTestId('searchbar')).toHaveValue('search term')
  })

  it('should display the given placeholder text', () => {
    const { getByTestId } = render(
      <SearchBar searchFunction={x => x} placeholder='Test' />
    )

    expect(getByTestId('searchbar')).toHaveAttribute('placeholder', 'Test')
  })

  it('should perform the search function when form is submitted', () => {
    const mockSearchFunction = jest.fn()
    const { getByTestId, getByRole } = render(
      <SearchBar searchFunction={mockSearchFunction} placeholder='Test' />
    )
    fireEvent.change(getByTestId('searchbar'), { target: { value: 'a' } })
    fireEvent.submit(getByRole('search-form'))
    expect(mockSearchFunction).toHaveBeenCalledWith('a')
  })
})
