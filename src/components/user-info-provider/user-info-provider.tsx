import isEmpty from 'lodash/isEmpty'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import {
  InjectedOrganisationInfoProps,
  withOrganisationInfo
} from '../../helpers'
import {
  groupAnalysis,
  identifyAnalysis,
  pageAnalysis
} from '../../helpers/segment-analytics'
import api from '../../packages/tradefact-api'
import { UserInfo } from '../../packages/tradefact-objects'
import FirstTimeUser from '../first-time-user'

const UserInfoContext = createContext<UserInfo | null>(null)

export interface UserInfoProviderProps {
  children: React.ReactNode
}

const UserInfoProvider = ({
  children,
  organisation,
  getOrganisationInfo
}: UserInfoProviderProps & InjectedOrganisationInfoProps) => {
  const [info, setInfo] = useState<UserInfo | null>(null)
  const [fetchingProfile, setFetchingProfile] = useState(true)
  const location = useLocation()
  const history = useHistory()

  const isPositiveStatus = !['Pending', 'NotFound'].includes(info?.status || '')
  const [firstTimeFetch, setFirstTimeFetch] = useState(
    !info || !isPositiveStatus
  )

  useEffect(() => {
    api
      .getProfile()
      .then(result => {
        if (!result) {
          return
        }

        setInfo(result)
        setFirstTimeFetch(['Pending', 'NotFound'].includes(result.status))
      })
      .finally(() => {
        setFetchingProfile(false)
      })
  }, [])

  useEffect(() => {
    if (info) {
      identifyAnalysis(info)
      groupAnalysis(info)
    }
  }, [info])

  useEffect(() => {
    if (info) {
      pageAnalysis(location.pathname.split('/')[1], info?.organisationId!)
    }
  }, [info, location])

  useEffect(() => {
    if (info && isPositiveStatus) {
      getOrganisationInfo()
    }
  }, [info, location])

  useEffect(() => {
    if (info) {
      const userHasEmptyCoreInfo = !!(
        organisation &&
        (isEmpty(organisation?.invoiceAddress) || !organisation?.currency)
      )
      if (userHasEmptyCoreInfo && !location.pathname.includes('/admin')) {
        history.push({
          pathname: '/admin'
        })
      }
    }
  }, [info, organisation, location])

  const handleFirstTimeFetch = (userInfo: UserInfo, isFirstTime: boolean) => {
    setInfo(userInfo)
    setFirstTimeFetch(isFirstTime)
  }

  return (
    <UserInfoContext.Provider value={info}>
      <FirstTimeUser
        fetchingProfile={fetchingProfile}
        userInfo={info}
        handleFirstTimeFetch={handleFirstTimeFetch}
      />
      {!firstTimeFetch && children}
    </UserInfoContext.Provider>
  )
}

export const useUserInfo = () => useContext(UserInfoContext)

export default withOrganisationInfo<UserInfoProviderProps>(UserInfoProvider)
