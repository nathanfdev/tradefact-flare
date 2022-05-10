import React from 'react'
import {
  Pagination as BootstrapPagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap'

export interface PaginationProps {
  count: number
  page: number
  pageSize: number

  onPageChange: (page: number) => void
}

const Pagination = ({
  count,
  page,
  pageSize,

  onPageChange
}: PaginationProps) => {
  const pageCount = Math.ceil(count / pageSize)
  if (pageCount <= 1) {
    return null
  }

  const left = Math.max(1, Math.min(page - 2, pageCount - 4))
  const right = left + Math.min(5, pageCount)

  return (
    <BootstrapPagination>
      <PaginationItem disabled={page <= 1}>
        <PaginationLink first onClick={() => onPageChange(1)} />
      </PaginationItem>
      <PaginationItem disabled={page <= 1}>
        <PaginationLink
          previous
          onClick={() => onPageChange(Math.max(1, page - 1))}
        />
      </PaginationItem>
      {[...Array(right - left).keys()]
        .map(index => left + index)
        .map(index => (
          <PaginationItem key={index} active={page === index}>
            <PaginationLink onClick={() => onPageChange(index)}>
              {index}
            </PaginationLink>
          </PaginationItem>
        ))}
      <PaginationItem disabled={page >= pageCount}>
        <PaginationLink
          next
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
        />
      </PaginationItem>
      <PaginationItem disabled={page >= pageCount}>
        <PaginationLink last onClick={() => onPageChange(pageCount)} />
      </PaginationItem>
    </BootstrapPagination>
  )
}

export default Pagination
