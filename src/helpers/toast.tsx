import React from 'react'
import { toast, ToastOptions } from 'react-toastify'
import { Toast, ToastBody, ToastHeader } from 'reactstrap'

export interface CustomToastOptions extends ToastOptions {
  title?: string
  icon?: string
}

interface ToastCallbackProps {
  closeToast: () => void
}

const customToast = (message: string, options?: CustomToastOptions) => {
  const { title, icon, ...rest } = options ?? {}
  toast.dismiss()
  toast(
    ({ closeToast }: ToastCallbackProps) => (
      <Toast>
        {title && (
          <ToastHeader toggle={closeToast} icon={icon}>
            {title}
          </ToastHeader>
        )}
        <ToastBody>{message}</ToastBody>
      </Toast>
    ),
    rest
  )
}

export default customToast
