import React from 'react'
import { useTranslation } from 'react-i18next'
import { User } from '../../../../packages/tradefact-objects'
import OrganisationUsersListItem from '../organisation-settings-users-list-item'

export interface UserTabProps {
  isTabletOrMobile: boolean
  users: User[]
  updateUser: (user: User) => any
  confirmDisableUser: (user: User) => any
  confirmResendInvite: (email: string) => any
}
const UserTab = ({
  isTabletOrMobile,
  users,
  updateUser,
  confirmDisableUser,
  confirmResendInvite
}: UserTabProps) => {
  const { t } = useTranslation()

  return isTabletOrMobile ? (
    <>
      <div className='responsive-table-wrap'>
        {users.map(user => (
          <OrganisationUsersListItem
            key={user.id}
            user={user}
            isMobile={isTabletOrMobile}
            updateUser={updateUser}
            confirmDisableUser={confirmDisableUser}
            resendInvite={confirmResendInvite}
          ></OrganisationUsersListItem>
        ))}
      </div>
    </>
  ) : (
    <>
      <div className='table_box table-responsive equal_table'>
        <table className='table table-hover'>
          <thead>
            <tr>
              <th scope='col'>{t('user.name')}</th>
              <th scope='col'>{t('generic.email')}</th>
              <th scope='col'>{t('user.status')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <OrganisationUsersListItem
                key={user.id}
                user={user}
                isMobile={isTabletOrMobile}
                updateUser={updateUser}
                confirmDisableUser={confirmDisableUser}
                resendInvite={confirmResendInvite}
              ></OrganisationUsersListItem>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
export default UserTab
