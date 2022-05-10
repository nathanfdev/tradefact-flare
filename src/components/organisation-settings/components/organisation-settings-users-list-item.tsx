import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown
} from 'reactstrap'
import { useUserInfo } from '../../../components/user-info-provider'
import { User } from '../../../packages/tradefact-objects'

export interface OrganisationUsersListItemProps {
  user: User
  isMobile: boolean
  updateUser(user: User): any
  confirmDisableUser(user: User): any
  resendInvite(email: string): any
}

const OrganisationUsersListItem = ({
  user,
  isMobile,
  updateUser,
  confirmDisableUser,
  resendInvite
}: OrganisationUsersListItemProps) => {
  const [collapseIsOpen, setCollapseIsOpen] = useState(false)
  const userInfo = useUserInfo()
  const { t } = useTranslation()

  const toggleCollapse = () => {
    setCollapseIsOpen(!collapseIsOpen)
  }

  return (
    <>
      {isMobile ? (
        <>
          <div
            className='responsive-table-row'
            onClick={toggleCollapse}
            key={user.id}
          >
            <div className='responsive-table-row__title'>{user?.fullname}</div>
            <div>
              <i className='far fa-ellipsis-v'></i>
            </div>
          </div>
          <Collapse
            isOpen={collapseIsOpen}
            onClosed={() => setCollapseIsOpen(false)}
            onOpened={() => setCollapseIsOpen(true)}
          >
            <table className='table-responsive'>
              <tbody>
                <tr>
                  <th>{t('generic.email')}:</th>
                  <td>{user?.email}</td>
                </tr>
                <tr>
                  <th>{t('user.role')}:</th>
                  <td>{user?.role?.join(', ')}</td>
                </tr>
                <tr>
                  <th>{t('user.status')}:</th>
                  <td>{user?.status}</td>
                </tr>
                <tr>
                  <td className='responsive-table-button'>
                    {user?.status === 'Active' && (
                      <>
                        <Button
                          color='primary'
                          onClick={() => updateUser(user)}
                        >
                          {t('generic.edit')}
                        </Button>

                        {user.id !== userInfo?.id && (
                          <Button
                            color='primary'
                            onClick={() =>
                              confirmDisableUser({ ...user, status: 'Disable' })
                            }
                          >
                            {t('generic.disable')}
                          </Button>
                        )}
                      </>
                    )}
                    {user?.status === 'Pending' && (
                      <Button
                        color='primary'
                        onClick={() => {
                          user?.email && resendInvite(user?.email)
                        }}
                      >
                        {t('account.resendInvite')}
                      </Button>
                    )}
                    {user?.status === 'Disabled' && (
                      <Button
                        color='primary'
                        onClick={() =>
                          updateUser({ ...user, status: 'Active' })
                        }
                      >
                        {t('account.resendInvite')}
                      </Button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </Collapse>
        </>
      ) : (
        <>
          <tr key={user?.id}>
            <td>{user?.fullname}</td>
            <td>{user?.email}</td>
            <td>
              <div className='product-last-row'>
                <span id='activeOrders'>
                  {t(`generic.${user?.status?.toLowerCase()}`)}
                </span>
                {user?.status === 'Active' && (
                  <UncontrolledButtonDropdown
                    direction='left'
                    className='float-right actions'
                  >
                    <DropdownToggle
                      color='transparent'
                      className='shadow-none rounded bg-transparent text-dark'
                    >
                      <i className='far fa-ellipsis-v'></i>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => updateUser(user)}>
                        <div className='d-flex flex-row justify-content-between w-100 align-item-center'>
                          <span>{t('generic.edit')} </span>
                          <i className='fas fa-pencil grey-color pr-1' />{' '}
                        </div>
                      </DropdownItem>
                      {user.id !== userInfo?.id && (
                        <DropdownItem
                          onClick={() =>
                            confirmDisableUser({ ...user, status: 'Disabled' })
                          }
                        >
                          {t('generic.disable')}
                        </DropdownItem>
                      )}
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
                )}
                {user?.status === 'Pending' && (
                  <UncontrolledButtonDropdown
                    direction='left'
                    className='float-right actions'
                  >
                    <DropdownToggle
                      color='transparent'
                      className='shadow-none rounded bg-transparent text-dark'
                    >
                      <i className='far fa-ellipsis-v'></i>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem
                        onClick={() => {
                          user?.email && resendInvite(user.email)
                        }}
                      >
                        {t('account.resendInvite')}
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
                )}
                {user?.status === 'Disabled' && (
                  <UncontrolledButtonDropdown
                    direction='left'
                    className='float-right'
                  >
                    <DropdownToggle
                      color='transparent'
                      className='shadow-none rounded bg-transparent text-dark'
                    >
                      <i className='far fa-ellipsis-v'></i>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem
                        onClick={() =>
                          updateUser({ ...user, status: 'Active' })
                        }
                      >
                        {t('generic.enable')}
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
                )}
              </div>
            </td>
          </tr>
        </>
      )}
    </>
  )
}

export default OrganisationUsersListItem
