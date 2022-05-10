import React from 'react'
import { useTranslation } from 'react-i18next'
import { Address } from '../../../../packages/tradefact-objects'
import LocationListItem from '../../../location-list-item'

export interface LocationTabProps {
  isTabletOrMobile: boolean
  locations: Address[]
  updateLocation(address: Address): any
  confirmDeleteLocation(address: Address): any
  invoiceID?: string
}
const LocationTab = ({
  isTabletOrMobile,
  locations,
  invoiceID,
  updateLocation,
  confirmDeleteLocation
}: LocationTabProps) => {
  const { t } = useTranslation()
  return isTabletOrMobile ? (
    <>
      <div className='responsive-table-wrap'>
        {locations.map(address => (
          <LocationListItem
            key={address.id}
            address={address}
            isMobile={isTabletOrMobile}
            updateLocation={updateLocation}
            confirmDeleteLocation={confirmDeleteLocation}
            isBypassNetworkTypeCheck={true}
            defaultAddressId={invoiceID}
          ></LocationListItem>
        ))}
      </div>
    </>
  ) : (
    <>
      <div className='table_box table-responsive equal_table'>
        <table className='table table-hover'>
          <thead>
            <tr>
              <th scope='col'>{t('location.locationName')}</th>
              <th scope='col'>{t('location.city')}</th>
              <th scope='col'>{t('location.country')}</th>
            </tr>
          </thead>
          <tbody>
            {locations.map(address => (
              <LocationListItem
                key={address.id}
                address={address}
                isMobile={isTabletOrMobile}
                updateLocation={updateLocation}
                confirmDeleteLocation={confirmDeleteLocation}
                isBypassNetworkTypeCheck={true}
                defaultAddressId={invoiceID}
              ></LocationListItem>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
export default LocationTab
