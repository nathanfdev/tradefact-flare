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
import { Address } from '../../packages/tradefact-objects'
import { NetworkType } from '../../packages/tradefact-objects/user'

export interface LocationListItemProps {
  address: Address
  isMobile: boolean
  updateLocation(address: Address): any
  confirmDeleteLocation(address: Address): any
  isBypassNetworkTypeCheck: boolean
  defaultAddressId?: string
}

const LocationListItem = ({
  address,
  isMobile,
  updateLocation,
  confirmDeleteLocation,
  isBypassNetworkTypeCheck,
  defaultAddressId
}: LocationListItemProps) => {
  const [collapseIsOpen, setCollapseIsOpen] = useState(false)

  const toggleCollapse = () => {
    setCollapseIsOpen(!collapseIsOpen)
  }
  const showModifications = [
    NetworkType.Managed,
    NetworkType.Connected
  ].includes(parseInt(address.networkConnectionType || ''))

  const { t } = useTranslation()
  return (
    <>
      {isMobile ? (
        <>
          <div
            className='responsive-table-row'
            onClick={toggleCollapse}
            key={address.id}
          >
            <div className='responsive-table-row__title'>
              {address?.name || 'Unkown'}
            </div>
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
                  <th>{t('location.city')}:</th>
                  <td>{address.city}</td>
                </tr>
                <tr>
                  <th>{t('location.country')}:</th>
                  <td>{address.country?.name}</td>
                </tr>
                <tr>
                  <th>{t('location.createdBy')}:</th>
                </tr>
                {(isBypassNetworkTypeCheck
                  ? isBypassNetworkTypeCheck
                  : showModifications) && (
                  <tr>
                    <td className='responsive-table-button'>
                      <Button
                        color='primary'
                        onClick={() => updateLocation(address)}
                      >
                        {t('location.editLocationAction')}
                      </Button>
                      <Button
                        color='primary'
                        onClick={() => confirmDeleteLocation(address)}
                      >
                        {t('location.deleteLocationAction')}
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Collapse>
        </>
      ) : (
        <>
          <tr key={address.id}>
            <td> {address?.name || 'Unkown'}</td>
            <td>{address.city}</td>
            <td>
              <div className='product-last-row'>
                <span id='activeOrders'>{address.country?.name}</span>
                {(isBypassNetworkTypeCheck
                  ? isBypassNetworkTypeCheck
                  : showModifications) && (
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
                      <DropdownItem onClick={() => updateLocation(address)}>
                        {t('location.editLocationAction')}
                        <i className='fas fa-pencil grey-color pl-4' />{' '}
                      </DropdownItem>
                      {defaultAddressId !== address.id && (
                        <DropdownItem
                          onClick={() => confirmDeleteLocation(address)}
                        >
                          {t('location.deleteLocationAction')}
                        </DropdownItem>
                      )}
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

export default LocationListItem
