import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from '.'
import api from '../packages/tradefact-api'
import { Directory } from '../packages/tradefact-objects'

export interface InjectedOrganisationInfoProps {
  organisation: Directory | null
  getOrganisationInfo: () => void
}

export const withOrganisationInfo = <P extends {}>(
  WrappedComponent: React.ComponentType<P & InjectedOrganisationInfoProps>
): React.ComponentType<P> => (props: P) => {
  const [organisation, setOrganisation] = useState<Directory | null>(null)

  const { t } = useTranslation()

  const getOrganisationInfo = () => {
    api
      .getCompany()
      .then(setOrganisation)
      .catch(() =>
        toast(t('validation.genericToastErrorMessage'), {
          title: t('generic.error'),
          icon: 'danger'
        })
      )
  }

  return (
    <WrappedComponent
      {...(props as P)}
      organisation={organisation}
      getOrganisationInfo={getOrganisationInfo}
    />
  )
}
