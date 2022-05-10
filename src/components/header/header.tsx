import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import {
  Badge,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'
import { handleLogout } from '../../helpers/auth'
import { toggleState } from '../../reducers/create-order-slice'
import { useAppDispatch } from '../app'

interface HeaderProps {
  menuOpen: boolean
  onMenuOpenChange: (open: boolean) => void
}

const Header = ({}: HeaderProps) => {
  const [environment] = useState(process.env.ENVIRONMENT)
  const location = useLocation()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const logoUrl = 'http://www.getflare.io'
  return (
    <>
      <div className='header-section'>
        <div className='header__left'>
          <a className='logo' target='_blank' href={logoUrl}>
            <img src='images/logo.svg' alt='Flare Logo' />
          </a>
          {environment !== 'PRODUCTION' && (
            <div className='ml-3'>
              {environment === 'local' && (
                <Badge className='badge-secondary'>
                  {environment + ' ENVIRONMENT'}
                </Badge>
              )}
              {environment === 'DEVELOPMENT' && (
                <Badge className='badge-success'>
                  {environment + ' ENVIRONMENT'}
                </Badge>
              )}
              {environment === 'QA' && (
                <Badge className='badge-danger'>
                  {environment + ' ENVIRONMENT'}
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className='header__right'>
          <div className='d-flex align-items-center'>
            <Link
              onClick={() => dispatch(toggleState('modalOpen'))}
              to={{
                pathname: '/create-order',
                state: { background: location }
              }}
            >
              <Button color='primary' className='rounded-container mr-3'>
                <i className='far fa-plus mr-2' />
                {t('generic.orderFlares')}
              </Button>
            </Link>

            <Link to='/' className='mx-3'>
              <i className='fas fa-map-marked-alt primary-color mr-2' />
              {t('map.mapView')}
            </Link>
            <Link to='list-view' className='mx-3'>
              <i className='fal fa-list-ul primary-color f-4 mr-2' />
              {t('list.listView')}
            </Link>
            <Link
              to={{ pathname: '/help', state: { background: location } }}
              className='mx-3'
            >
              {t('generic.help')}
            </Link>
            <UncontrolledDropdown className='ml-3'>
              <DropdownToggle
                className='core-dropdown-toggle rounded-container'
                outline
              >
                <div className='d-flex align-items-center justify-content-between'>
                  <div>
                    <p>{t('account.account')}</p>
                  </div>
                  <div>
                    <i className='fal fa-chevron-down ml-2' />
                  </div>
                </div>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem tag={Link} to='/admin'>
                  {t('company.company')}
                </DropdownItem>
                <DropdownItem tag={Link} to='/user-profile'>
                  {t('generic.profile')}
                </DropdownItem>
                <DropdownItem tag={Link} to='/order-history'>
                  {t('list.orderHistory')}
                </DropdownItem>
                <DropdownItem
                  tag={Link}
                  onClick={handleLogout}
                  to='/'
                  className='d-flex justify-content-between align-item-center'
                >
                  {t('account.logout')}{' '}
                  <i
                    className='far fa-sign-out-alt grey-color'
                    style={{ lineHeight: 'unset' }}
                  ></i>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
