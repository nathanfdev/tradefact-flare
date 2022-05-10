import React from 'react'
import { Button } from 'reactstrap'
import { Document } from '../../../../packages/tradefact-objects'

export interface DocumentListItemProps {
  document: Document
}

const DocumentListItem = ({ document }: DocumentListItemProps) => {
  return (
    <tr className='d-flex flex-wrap'>
      <td className='tf-td-40'>
        <span className='title'>Name: </span>
        {document.name}
      </td>
      <td className='tf-td-40'>
        <span className='title'>Date Uploaded: </span>
        {document.dateUploaded.toString()}
      </td>
      <td className='tf-td-20 d-flex justify-content-end'>
        <Button className='btn-circle' color='danger'>
          <i className='fas fa-trash'></i>
        </Button>
      </td>
    </tr>
  )
}

export default DocumentListItem
