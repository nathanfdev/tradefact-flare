import React from 'react'

interface StatusIconProps {
  isConnected: boolean
}

export const OrganisationStatusIcon = ({ isConnected }: StatusIconProps) => {
  return (
    <>
      {isConnected ? (
        <span
          className={`badge badge-pill bg-transparent border p-2 text-success border-success`}
        >
          Connected
        </span>
      ) : (
        <span
          className={`badge badge-pill bg-transparent border p-2 text-warning border-warning`}
        >
          Invite Pending
        </span>
      )}
    </>
  )
}
