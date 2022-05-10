import React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

interface CustomModalProps {
  isOpen: boolean
  body: React.ReactNode
  header: React.ReactNode
  positiveActionText?: string
  negativeActionText?: string
  role?: string
  loading: boolean
  onPositiveAction?: () => void
  onNegativeAction?: () => void
  onToggle: () => void
  isPostiveActionButtonComeFirst?: boolean
}

const CustomModal = ({
  isOpen,
  body,
  header,
  role,
  loading,
  positiveActionText,
  onPositiveAction,
  negativeActionText,
  onNegativeAction,
  onToggle,
  isPostiveActionButtonComeFirst
}: CustomModalProps) => {
  const doPositiveAction = () => {
    onPositiveAction && onPositiveAction()
  }

  const doNegativeAction = () => {
    onNegativeAction && onNegativeAction()
  }

  return (
    <Modal isOpen={isOpen} size='md' role={role}>
      <ModalHeader toggle={onToggle}>{header}</ModalHeader>
      <ModalBody>{body}</ModalBody>
      {!isPostiveActionButtonComeFirst ? (
        <ModalFooter>
          {negativeActionText && negativeActionText.length ? (
            <Button
              color='link'
              onClick={() => doNegativeAction()}
              role='modal-negative-action'
              size='sm'
              disabled={loading}
            >
              {negativeActionText}
            </Button>
          ) : null}
          {positiveActionText && positiveActionText.length ? (
            <Button
              color='primary'
              onClick={() => {
                doPositiveAction()
              }}
              role='modal-positive-action'
              size='sm'
              disabled={loading}
            >
              {loading && (
                <span
                  className='spinner-border spinner-border-sm mr-2'
                  role='status'
                  aria-hidden='true'
                ></span>
              )}
              {positiveActionText}
            </Button>
          ) : null}
        </ModalFooter>
      ) : (
        <ModalFooter>
          {negativeActionText && negativeActionText.length ? (
            <Button
              color='primary'
              outline
              onClick={() => doNegativeAction()}
              role='modal-negative-action'
              className='rounded-container'
              size='sm'
              disabled={loading}
            >
              {negativeActionText}
            </Button>
          ) : null}
          {positiveActionText && positiveActionText.length ? (
            <Button
              color='primary'
              onClick={() => {
                doPositiveAction()
              }}
              role='modal-positive-action'
              size='sm'
              className='rounded-container px-4'
              disabled={loading}
            >
              {loading && (
                <span
                  className='spinner-border spinner-border-sm mr-2'
                  role='status'
                  aria-hidden='true'
                ></span>
              )}
              {positiveActionText}
            </Button>
          ) : null}
        </ModalFooter>
      )}
    </Modal>
  )
}

export default CustomModal
