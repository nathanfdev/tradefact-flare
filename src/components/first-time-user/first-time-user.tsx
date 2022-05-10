import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { Alert, Modal, ModalBody, Spinner } from 'reactstrap'
import { toast } from '../../helpers'
import { handleLogout } from '../../helpers/auth'
import api from '../../packages/tradefact-api'
import { UserInfo } from '../../packages/tradefact-objects'

interface FirstTimeUserProps {
  fetchingProfile: boolean
  userInfo: UserInfo | null
  handleFirstTimeFetch: (userInfo: UserInfo, isFirstTime: boolean) => void
}

const FirstTimeUser = ({
  fetchingProfile,
  userInfo,
  handleFirstTimeFetch
}: FirstTimeUserProps) => {
  const [loading, setLoading] = useState(true)
  const [
    showActivationFailureMessage,
    setShowActivationFailureMessage
  ] = useState(false)

  const isPositiveStatus = !['Pending', 'NotFound'].includes(
    userInfo?.status || ''
  )

  const history = useHistory()
  const { t } = useTranslation()

  useEffect(() => {
    if (!loading || userInfo?.status !== 'Pending') {
      return
    }

    const interval = setInterval(() => {
      api
        .getProfile()
        .then(result => {
          if (result.status === 'Active') {
            handleFirstTimeFetch(result, false)
            setLoading(false)
            if (
              result.hasCoreOrgData &&
              result.organisationtype !== 'PARTNER'
            ) {
              history.push({
                search: `?companySetupComplete=true`
              })
            }
          }
        })
        .catch(() =>
          toast(t('user.toast.userProfileFetchError'), {
            title: t('generic.error'),
            icon: 'danger'
          })
        )
    }, 2000)
    return () => clearInterval(interval)
  }, [loading, userInfo])

  useEffect(() => {
    if (!loading || isPositiveStatus) {
      return
    }

    if (userInfo?.status === 'NotFound') {
      const timer = setTimeout(handleLogout, 5000)

      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      setShowActivationFailureMessage(true)
      const signoutTimer = setTimeout(handleLogout, 5000)

      return () => clearTimeout(signoutTimer)
    }, 2000 * 60)

    return () => clearTimeout(timer)
  }, [loading, userInfo])

  if (fetchingProfile || isPositiveStatus) {
    return null
  }

  return (
    <Modal isOpen={loading} size='lg' className='first-time-user-modal'>
      <ModalBody>
        <div className='text-center py-4'>
          {showActivationFailureMessage && (
            <Alert color='danger'>
              {t('account.accountActivationFailureMessage')}
            </Alert>
          )}
          {userInfo?.status === 'Pending' && !showActivationFailureMessage && (
            <>
              <Spinner color='primary' />
              <p className='mt-3'>{t('account.setupAccountMessage')}</p>
            </>
          )}
          {userInfo?.status === 'NotFound' && !showActivationFailureMessage && (
            <Alert color='danger'>{t('account.accountNotFoundMessage')}</Alert>
          )}
        </div>
      </ModalBody>
    </Modal>
  )
}

export default FirstTimeUser
