import { render } from '@testing-library/react'
import React from 'react'
import DocumentListItem from '.'
import { MemoryRouter } from 'react-router-dom'

describe('<DocumentListItem />', () => {
  const document = {
    id: '1234',
    name: 'Invoice Document',
    description: 'Invoice doc',
    dateUploaded: new Date().toString(),
    blobUrl: 'invoicedocument.doc'
  }
  it('should render', () => {
    expect(() =>
      render(
        <MemoryRouter>
          <DocumentListItem document={document} />
        </MemoryRouter>
      )
    ).not.toThrow()
  })
})
