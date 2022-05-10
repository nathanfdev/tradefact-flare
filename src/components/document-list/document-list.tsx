import React, { useState } from 'react'
import { Table } from 'reactstrap'
import { Pagination } from '..'
import { Document } from '../../packages/tradefact-objects'
import { DocumentListItem } from './components'

export interface DocumentListProps {
  documents: Document[]
}

const DocumentList = ({ documents }: DocumentListProps) => {
  const [count] = useState(150)
  const [page, setPage] = useState(1)

  return (
    <>
      <Table>
        <thead>
          <tr className='d-flex'>
            <th className='d-none d-md-block tf-td-40'>Name</th>
            <th className='d-none d-md-block tf-td-40'>Date Uploaded</th>
            <th className='d-none d-md-block tf-td-20'>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {documents.map(document => (
            <DocumentListItem key={document.id} document={document} />
          ))}
        </tbody>
      </Table>
      <Pagination
        count={count}
        page={page}
        pageSize={20}
        onPageChange={setPage}
      />
    </>
  )
}

export default DocumentList
