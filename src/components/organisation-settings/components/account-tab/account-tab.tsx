import React from 'react'
import { Button } from 'reactstrap'

import { Address, Directory } from '../../../../packages/tradefact-objects'

import { useTranslation } from 'react-i18next'

export interface AccountTabProps {
  organisation: Directory
  setEditInvoiceAddress: (value: boolean) => void
  toggleInvoiceLocationModal: () => void
  toggleTaxModal: () => void
  setEditLocation: (address: Address) => void
  onAdminUpdated: () => void
}

const AccountTab = ({
  organisation,
  setEditInvoiceAddress,
  toggleInvoiceLocationModal,
  toggleTaxModal,
  setEditLocation
}: AccountTabProps) => {
  const { t } = useTranslation()

  return (
    <div className='account'>
      <div>
        <span className='main-heading'>{t('account.acountSetting')}</span>
      </div>
      <div className='d-flex flex-wrap flex-sm-row flex-xs-column justify-content-between my-3'>
        <div className='d-flex flex-column justify-content-start w-50'>
          <span className='heading'>{t('company.companyName')}</span>
          <div className='d-flex align-item-center'>
            <span>{organisation.name}</span>
          </div>
        </div>
        <div className='d-flex flex-column justify-content-start w-50'>
          <span className='heading'>{t('company.taxID')}</span>
          {organisation.taxId ? (
            <div className='d-flex justify-content-start align-item-center'>
              <span>{organisation.taxId}</span>
              <Button
                className='btn border bg-white  ml-2 px-2 py-1'
                size='sm'
                onClick={() => {
                  toggleTaxModal()
                }}
                outline
              >
                <i className='fas fa-pencil grey-color' />
              </Button>
            </div>
          ) : (
            <div className='d-flex justify-content-between'>
              {t('company.taxID')}
              <Button
                className='btn border bg-white mt-1 ml-2 px-2 py-1'
                size='sm'
                onClick={toggleTaxModal}
              >
                <i className='fas fa-pencil grey-color' />
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className='seprator-line my-3'></div>
      <div className='d-flex flex-column justify-content-start'>
        <span className='heading mb-2'>{t('company.companyAddress')}</span>
        <div className='d-flex flex-column mb-3 border round-box'>
          {organisation.invoiceAddress ? (
            <>
              <div className='d-flex justify-content-between'>
                <div>
                  <p className='mb-2 addres-name'>
                    {organisation.invoiceAddress?.name}
                  </p>{' '}
                  <p className='mb-0'>
                    {organisation.invoiceAddress?.addressLine1}

                    {organisation.invoiceAddress?.addressLine2 &&
                      organisation.invoiceAddress?.addressLine2}
                  </p>
                  {organisation.invoiceAddress?.addressLine3 && (
                    <p className='mb-0'>
                      {organisation.invoiceAddress?.addressLine3}
                    </p>
                  )}
                  <p className='mb-0'>{organisation.invoiceAddress?.city}</p>
                  {organisation.invoiceAddress?.county && (
                    <p className='mb-0'>
                      {organisation.invoiceAddress?.county}
                    </p>
                  )}
                  <p className='mb-0'>
                    {organisation.invoiceAddress?.country?.name}
                  </p>
                  <p>{organisation.invoiceAddress?.postalCode}</p>
                </div>
                <Button
                  className='btn border bg-white mt-1 ml-2 px-2 py-1'
                  onClick={() => {
                    setEditInvoiceAddress(true)
                    organisation.invoiceAddress &&
                      setEditLocation(organisation.invoiceAddress)
                    toggleInvoiceLocationModal()
                  }}
                >
                  <i className='fas fa-pencil grey-color' />
                </Button>
              </div>
            </>
          ) : (
            <div className='d-flex justify-content-between'>
              {t('company.companyAddress')}
              <Button
                className='btn border bg-white mt-1 ml-2 px-2 py-1'
                size='sm'
                onClick={() => {
                  setEditInvoiceAddress(true)
                  toggleInvoiceLocationModal()
                }}
              >
                <i className='fas fa-pencil grey-color' />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default AccountTab
