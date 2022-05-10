import { render } from '@testing-library/react'
import React from 'react'
import Pagination from '.'

describe('<Pagination />', () => {
  it('should render', () => {
    const onPageChange = jest.fn()
    expect(() =>
      render(
        <Pagination
          count={200}
          page={1}
          pageSize={25}
          onPageChange={onPageChange}
        />
      )
    ).not.toThrow()
  })
})
