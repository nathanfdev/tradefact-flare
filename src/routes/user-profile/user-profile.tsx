import { get } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown
} from 'reactstrap'
import { useUserInfo } from '../../components/user-info-provider'
import { useAppDispatch, useAppSelector } from '../../components/app'
import { updateUserPreferences } from '../../packages/tradefact-api'

const UserProfile = () => {
  const dispatch = useAppDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const { userInfo } = useAppSelector(state => state.user)
  const userPreferences = get(userInfo, 'userPreferences', {})
  const info = useUserInfo()
  const { t } = useTranslation()
  if (info === null) {
    return null
  }

  useEffect(() => {
    if (userInfo && !userPreferences.tempratureUnit) {
      dispatch(
        updateUserPreferences({
          userId: userInfo?.id,
          body: {
            ...userPreferences,
            tempratureUnit: t('user.degreesCelsius')
          }
        })
      )
    }
  }, [userInfo])

  const handleChange = (e: any) => {
    setIsOpen(!isOpen)
    dispatch(
      updateUserPreferences({
        userId: userInfo?.id,
        body: {
          ...userPreferences,
          tempratureUnit: e
        }
      })
    )
  }
  console.log(isOpen)
  return (
    <div>
      <div className='box'>
        <div className='white_box table_box__head'>
          <div className='table_box--title'>
            <span>
              <i className='fal fa-user'></i>
            </span>
            <h3> {t('user.userProfile')}</h3>
          </div>
        </div>
        <div className='white_box user_profile_box'>
          <div className='user_profile__head'>
            <div className='row'>
              <div className='col-md-6 col-lg-4'>
                <div className='user_profile__head-card'>
                  <span>{t('generic.fullName')}</span>
                  <h3 className='mt-3'>{info.fullname}</h3>
                </div>
              </div>
              <div className='col-md-6 col-lg-4'>
                <div className='user_profile__head-card'>
                  <span>{t('generic.emailAddress')}</span>
                  <h3 className='mt-3'>{info.email}</h3>
                </div>
              </div>
              <div className='col-md-6 col-lg-4'>
                <div className='user_profile__head-card'>
                  <span>{t('user.temperatureUnit')}</span>
                  <div className='d-flex align-item-center'>
                    <Dropdown
                      className='bg-transparent border-secondary rounded-0 w-100'
                      isOpen={isOpen}
                      toggle={() => setIsOpen(!isOpen)}
                    >
                      <DropdownToggle className='w-60 py-1 pr-0  text-left dropdown-button bg-transparent border  bg-transparent mt-2'>
                        <div
                          className='d-flex flex-row align-item-center justify-content-between '
                          color='secondary'
                        >
                          <h3 className='mb-0'>
                            {userPreferences?.tempratureUnit}
                          </h3>
                          <i className='fal fa-angle-down pr-2 pt-1'></i>
                        </div>
                      </DropdownToggle>
                      <DropdownMenu left={true}>
                        <DropdownItem
                          toggle={false}
                          key={'°C'}
                          onClick={() => handleChange(t('user.degreesCelsius'))}
                        >
                          {t('user.degreesCelsius')}
                        </DropdownItem>
                        <DropdownItem
                          toggle={false}
                          key={'°F'}
                          onClick={() =>
                            handleChange(t('user.degreesFahrenheit'))
                          }
                        >
                          {t('user.degreesFahrenheit')}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
