import { render } from '@testing-library/react'
import React from 'react'
import DocumentList from '.'

describe('<DocumentList />', () => {
  it('should render', () => {
    expect(() =>
      render(
        <DocumentList
          documents={[
            {
              id: '1234',
              name: 'Invoice Document',
              dateUploaded: new Date().toString(),
              blobUrl: 'invoicedocument.doc'
            },
            {
              id: '5678',
              name: 'Import Dates Document',
              dateUploaded: new Date().toString(),
              blobUrl: 'importdatesdocument.doc'
            }
          ]}
        />
      )
    ).not.toThrow()
  })
})
