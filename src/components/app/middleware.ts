import { isRejected, Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import { t } from 'i18next'
import { toast } from '../../helpers'

export const rtkQueryErrorLogger: Middleware = (
  _api: MiddlewareAPI
) => next => action => {
  if (isRejected(action)) {
    toast(t('validation.genericToastErrorMessage'), {
      title: t('generic.error'),
      icon: 'danger'
    })
  }

  return next(action)
}
