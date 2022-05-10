import React from 'react'

interface LoadingWrapperProps {
  loading: boolean
  children: React.ReactElement
}

const LoadingWrapper = ({ loading, children }: LoadingWrapperProps) => {
  if (!loading) {
    return children
  }

  return (
    <span
      className='spinner-border spinner-border-sm mr-2'
      role='status'
      aria-hidden='true'
    />
  )
}

export default LoadingWrapper
