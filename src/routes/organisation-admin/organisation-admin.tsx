import React, { useEffect } from 'react'
import { OrganisationSettings } from '../../components'
import { useUserInfo } from '../../components/user-info-provider'
import {
  InjectedOrganisationInfoProps,
  withOrganisationInfo
} from '../../helpers'

interface OrganisationAdminProps extends InjectedOrganisationInfoProps {}

const OrganisationAdmin = ({
  organisation,
  getOrganisationInfo
}: OrganisationAdminProps) => {
  const info = useUserInfo()

  useEffect(() => {
    if (info === null) {
      return
    }
    getOrganisationInfo()
  }, [info])

  if (!organisation) {
    return null
  }

  return (
    <OrganisationSettings
      organisation={organisation}
      onAdminUpdated={getOrganisationInfo}
    />
  )
}

export default withOrganisationInfo<OrganisationAdminProps>(OrganisationAdmin)
