import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { useHistory } from 'react-router-dom'
import {
  Alert,
  Col,
  DropdownMenu,
  DropdownToggle,
  Modal,
  Row,
  Spinner,
  UncontrolledButtonDropdown
} from 'reactstrap'
import { CustomModal, Pagination } from '..'
import SearchInput from '../../common-components/search-input'
import { toast } from '../../helpers'
import api from '../../packages/tradefact-api'
import { Address, Directory, User } from '../../packages/tradefact-objects'
import { useQuery } from '../../packages/use-query'
import LocationModal from '../location-modal'
import AccountTab from './components/account-tab/account-tab'
import CompanySetupModal from './components/company-setup-modal'
import LocationTab from './components/location-tab'
import TaxModal from './components/tax-modal'
import UserModal from './components/user-modal'
import UserTab from './components/user-tab'
enum Tabs {
  Account,
  Users,
  Locations
}

interface OrganisationSettingsProps {
  organisation: Directory
  onAdminUpdated: () => void
}

const OrganisationSettings = ({
  organisation,
  onAdminUpdated
}: OrganisationSettingsProps) => {
  const [activeTab, setActiveTab] = useState(Tabs.Account)
  const [locations, setLocations] = useState<Address[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [editLocation, setEditLocation] = useState<Address>({})
  const [deleteLocationId, setDeleteLocationId] = useState('')
  const [editUser, setEditUser] = useState<User | null>(null)
  const [disableUser, setDisableUser] = useState<User | null>(null)
  const [deleteLocationModalOpen, setDeleteLocationModalOpen] = useState(false)
  const [disableUserModalOpen, setDisableUserModalOpen] = useState(false)
  const [resendInviteModalOpen, setResendInviteModalOpen] = useState(false)
  const [resendInviteId, setResendInviteId] = useState('')
  const [taxModalOpen, setTaxModalOpen] = useState(false)
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [editInvoiceAddress, setEditInvoiceAddress] = useState(false)
  const [invoiceLocationModalOpen, setInvoiceLocationModalOpen] = useState(
    false
  )

  //Locations Pagination
  const [totalLocationsResultsCount, setTotalLocationsResultsCount] = useState(
    0
  )
  const [totalUsersResultsCount, setTotalUsersResultsCount] = useState(0)
  const [usersLoading, setUsersLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const [loading, setLoading] = useState(false)
  const pageSize = 10
  const [
    {
      userSearch: userSearch = '',
      userPage: userPageNum = '1',
      locationSearch: locationSearch = '',
      locationPage: locationPageNum = '1'
      // isCompanySetupOpen = 'false'
    },
    updateQueryString
  ] = useQuery()
  const [companySetupModalOpen, setCompanySetupModalOpen] = useState(false)
  const [deleteLocationName, setDeleteLocationName] = useState('')
  const history = useHistory()

  const { t } = useTranslation()
  const getLocations = (search: string, pageNumber: number) => {
    setLocationLoading(true)
    api
      .listCompanyAddressesNoId(search, pageNumber, pageSize)
      .then(page => {
        setTotalLocationsResultsCount(page.paging.totalCount)
        setLocations(page.items)
      })
      .catch(() =>
        toast(t('validation.genericToastErrorMessage'), {
          title: t('generic.error'),
          icon: 'danger'
        })
      )
      .finally(() => {
        setLocationLoading(false)
      })
  }

  const getUsers = (search: string, pageNumber: number) => {
    setUsersLoading(true)
    api
      .listUsers(search, pageNumber, pageSize)
      .then(page => {
        setUsers(page.items)
        setTotalUsersResultsCount(page.paging.totalCount)
      })
      .catch(() =>
        toast(t('validation.genericToastErrorMessage'), {
          title: t('generic.error'),
          icon: 'danger'
        })
      )
      .finally(() => {
        setUsersLoading(false)
      })
  }

  const refreshLocations = (searchValue: string, pageNumber: number) => {
    if (searchValue.length === 0) {
      getLocations(searchValue, pageNumber)
      return
    } else if (searchValue.length < 3) {
      return
    }

    const id = setTimeout(() => {
      getLocations(searchValue, pageNumber)
    }, 500)

    return () => clearTimeout(id)
  }

  const toggleLocationModal = () => {
    setLocationModalOpen(!locationModalOpen)
  }

  const toggleInvoiceLocationModal = () => {
    setInvoiceLocationModalOpen(!invoiceLocationModalOpen)
  }

  const toggleUserModal = () => {
    if (userModalOpen) {
      setEditLocation({})
      setEditInvoiceAddress(false)
    }
    setUserModalOpen(!userModalOpen)
  }

  const toggleTaxModal = () => {
    setTaxModalOpen(!taxModalOpen)
  }

  const updateLocation = (address: Address) => {
    setEditLocation(address)
    setLocationModalOpen(true)
  }

  const updateUser = (user: User) => {
    setEditUser(user)
    setUserModalOpen(true)
  }

  const confirmDeleteLocation = (address: Address) => {
    address.id && setDeleteLocationId(address.id)
    address.name && setDeleteLocationName(address.name)
    setDeleteLocationModalOpen(true)
  }

  const confirmDisableUser = (user: User | null) => {
    setDisableUser(user)
    setDisableUserModalOpen(true)
  }

  const confirmResendInvite = (id: string) => {
    setResendInviteId(id)
    setResendInviteModalOpen(true)
  }

  const deleteLocation = (addressId: string) => {
    setLoading(true)
    api
      .deleteAddress(addressId)
      .then(() => {
        toast(t('location.toast.deletionSuccessMessage'), {
          title: t('location.toast.deletionTitle'),
          icon: 'success'
        })
        updateQueryString({
          locationPage: 1
        })
        refreshLocations(locationSearch, parseInt(locationPageNum))
      })
      .catch(() =>
        toast(t('validation.genericToastErrorMessage'), {
          title: t('generic.error'),
          icon: 'danger'
        })
      )
      .finally(() => {
        setDeleteLocationModalOpen(false)
        setDeleteLocationId('')
        setLoading(false)
      })
  }

  const disableUserhandler = (user: User | null) => {
    setLoading(true)
    user &&
      api
        .updateUser(disableUser as User)
        .then(() => {
          toast(t('user.toast.disabledSuccessMessage'), {
            title: t('user.toast.disabledTitle'),
            icon: 'success'
          })
          updateQueryString({
            userPage: 1
          })
          getUsers(userSearch, parseInt(userPageNum))
        })
        .catch(() => {
          toast(t('validation.genericToastErrorMessage'), {
            title: t('generic.error'),
            icon: 'danger'
          })
        })
        .finally(() => {
          setLoading(false)
          setDisableUserModalOpen(false)
        })
  }

  const resendInvite = () => {
    if (resendInviteId.length) {
      setLoading(true)
      api
        .resendInvite(resendInviteId)
        .then(() => {
          toast(t('invitation.toast.resendInviteMessage'), {
            title: t('invitation.toast.resendInviteTitle'),
            icon: 'success'
          })
        })
        .catch(() => {
          toast(t('validation.genericToastErrorMessage'), {
            title: t('generic.error'),
            icon: 'danger'
          })
        })
        .finally(() => {
          setResendInviteModalOpen(false)
          setResendInviteId('')
          setLoading(false)
        })
    }
  }

  const toggle = (tab: Tabs) => {
    if (activeTab !== tab) {
      updateQueryString({
        locationPage: 1,
        locationSearch: ''
      })
      setActiveTab(tab)
    }
  }

  useEffect(() => {
    refreshLocations(locationSearch, parseInt(locationPageNum))
  }, [locationSearch, parseInt(locationPageNum)])

  useEffect(() => {
    if (userSearch.length === 0) {
      getUsers(userSearch, parseInt(userPageNum))
      return
    } else if (userSearch.length < 3) {
      return
    }

    const id = setTimeout(() => {
      getUsers(userSearch, parseInt(userPageNum))
    }, 500)

    return () => clearTimeout(id)
  }, [userSearch, parseInt(userPageNum)])

  useEffect(() => {
    updateQueryString({
      userPage: '1'
    })
  }, [userSearch])

  useEffect(() => {
    updateQueryString({
      locationPage: '1'
    })
  }, [locationSearch])

  const handleUserSearchChange = (search: string) => {
    updateQueryString({
      userSearch: search
    })
  }

  const handleLocationSearchChange = (search: string) => {
    updateQueryString({
      locationSearch: search
    })
  }

  const handleClosingCompanySetup = () => {
    onAdminUpdated()
    setCompanySetupModalOpen(false)
    getLocations(locationSearch, parseInt(locationPageNum))
    history.push('/admin')
  }

  return (
    <div>
      <div className='box my-4'>
        <div className='tab_box'>
          <div className='tab_head tab-head-embed flex_head tab_sm white_box rounded px-4'>
            <ul>
              <li className={`${activeTab === Tabs.Account ? 'active' : ''}`}>
                <a
                  onClick={() => {
                    toggle(Tabs.Account)
                  }}
                >
                  {t('account.account')}
                </a>
              </li>
              <li className={`${activeTab === Tabs.Users ? 'active' : ''}`}>
                <a
                  onClick={() => {
                    toggle(Tabs.Users)
                  }}
                >
                  {t('user.users')}
                </a>
              </li>
              <li className={`${activeTab === Tabs.Locations ? 'active' : ''}`}>
                <a
                  onClick={() => {
                    toggle(Tabs.Locations)
                  }}
                >
                  {t('location.locations')}
                </a>
              </li>
            </ul>
            {activeTab === Tabs.Locations ? (
              <div className='table_box__header--right'>
                <div className='table_search'>
                  <form
                    className='form-inline'
                    onSubmit={e => e.preventDefault()}
                  >
                    <input
                      type='search'
                      className='form-control'
                      value={locationSearch.replace(/%20/g, ' ')}
                      onChange={e => {
                        updateQueryString({
                          locationPage: 1
                        })
                        handleLocationSearchChange(e.target.value)
                      }}
                      placeholder={t('location.searchPlaceholder')}
                    />
                    <button type='button' className='btn btn-search'>
                      {' '}
                      <i className='fal fa-search'></i>{' '}
                    </button>
                  </form>
                </div>
                <UncontrolledButtonDropdown
                  direction='down'
                  className='table_mobile_search'
                >
                  <DropdownToggle color='transparent'>
                    <i className='far fa-search'></i>
                  </DropdownToggle>

                  <DropdownMenu right>
                    <form
                      className='form-inline dropdown-search'
                      onSubmit={e => e.preventDefault()}
                    >
                      <input
                        type='search'
                        className='form-control'
                        value={locationSearch.replace(/%20/g, ' ')}
                        onChange={e => {
                          updateQueryString({
                            locationPage: 1
                          })
                          handleLocationSearchChange(e.target.value)
                        }}
                        placeholder={t('location.searchPlaceholder')}
                      />
                      <button type='button' className='btn btn-search'>
                        {' '}
                        <i className='fal fa-search'></i>{' '}
                      </button>
                    </form>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
                <div className='add_item'>
                  <button
                    type='button'
                    data-toggle='modal'
                    data-target='#new_location'
                    className='btn grey-oval-buttons '
                    onClick={() => {
                      setEditLocation({})
                      toggleLocationModal()
                    }}
                  >
                    <i className='far fa-plus'></i>
                    <span className='btn-label ml-2 d-none d-md-inline-block'>
                      {t('location.newLocation')}
                    </span>{' '}
                  </button>
                </div>
              </div>
            ) : null}
            {activeTab === Tabs.Users ? (
              <div className='table_box__header--right'>
                <div className='table_search'>
                  <SearchInput
                    placeholder={`${t('user.searchPlaceholder')}...`}
                    onSearchChange={(value: string) => {
                      updateQueryString({
                        userPage: 1
                      })
                      handleUserSearchChange(value)
                    }}
                  />
                </div>
                <UncontrolledButtonDropdown
                  direction='down'
                  className='table_mobile_search'
                >
                  <DropdownToggle color='transparent'>
                    <i className='far fa-search'></i>
                  </DropdownToggle>

                  <DropdownMenu right>
                    <form
                      className='form-inline dropdown-search'
                      onSubmit={e => e.preventDefault()}
                    >
                      <input
                        type='search'
                        className='form-control'
                        value={userSearch.replace(/%20/g, ' ')}
                        onChange={e => {
                          updateQueryString({
                            userPage: 1
                          })
                          handleUserSearchChange(e.target.value)
                        }}
                        placeholder={t('user.searchPlaceholder')}
                      />
                      <button
                        type='button'
                        className='btn btn-search'
                        onClick={toggleUserModal}
                      >
                        {' '}
                        <i className='fal fa-search'></i>{' '}
                      </button>
                    </form>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
                <div className='add_item'>
                  <button
                    type='button'
                    data-toggle='modal'
                    data-target='#new_user'
                    className='btn grey-oval-buttons'
                    onClick={() => {
                      setEditUser(null)
                      toggleUserModal()
                    }}
                  >
                    <i className='fal fa-plus'></i>
                    <span className='btn-label ml-2 d-none d-md-inline-block'>
                      {t('user.newUser')}
                    </span>{' '}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
          <div className='tab_content white_box rounded mt-2'>
            {activeTab === Tabs.Account ? (
              <AccountTab
                organisation={organisation}
                setEditInvoiceAddress={setEditInvoiceAddress}
                toggleTaxModal={toggleTaxModal}
                setEditLocation={setEditLocation}
                toggleInvoiceLocationModal={toggleInvoiceLocationModal}
                onAdminUpdated={onAdminUpdated}
              />
            ) : null}
            {activeTab === Tabs.Locations ? (
              <>
                {locationLoading ? (
                  <div className='text-center py-4'>
                    <Spinner color='primary' />
                  </div>
                ) : (
                  <>
                    {locations.length ? (
                      <>
                        <LocationTab
                          locations={locations}
                          isTabletOrMobile={isTabletOrMobile}
                          updateLocation={updateLocation}
                          confirmDeleteLocation={confirmDeleteLocation}
                          invoiceID={organisation.invoiceAddress?.id}
                        />
                        <Row className='mt-2'>
                          <Col className='d-flex justify-content-center'>
                            <Pagination
                              count={totalLocationsResultsCount}
                              onPageChange={_num => {
                                updateQueryString({
                                  locationPage: _num
                                })
                              }}
                              page={parseInt(locationPageNum)}
                              pageSize={pageSize}
                            />
                          </Col>
                        </Row>
                      </>
                    ) : (
                      <>
                        <Alert color='primary'>
                          {locationSearch.length
                            ? t('location.searchAlert', {
                                locationSearch: locationSearch.replace(
                                  /%20/g,
                                  ' '
                                )
                              })
                            : t('noLocationAddedAlert')}
                        </Alert>
                      </>
                    )}
                  </>
                )}
              </>
            ) : null}
            {activeTab === Tabs.Users ? (
              <>
                {usersLoading ? (
                  <div className='text-center py-4'>
                    <Spinner color='primary' />
                  </div>
                ) : (
                  <>
                    {users.length ? (
                      <>
                        <UserTab
                          isTabletOrMobile={isTabletOrMobile}
                          users={users}
                          updateUser={updateUser}
                          confirmDisableUser={confirmDisableUser}
                          confirmResendInvite={confirmResendInvite}
                        />

                        <Row className='mt-2'>
                          <Col className='d-flex justify-content-center'>
                            <Pagination
                              count={totalUsersResultsCount}
                              onPageChange={_num => {
                                updateQueryString({
                                  userPage: _num
                                })
                              }}
                              page={parseInt(userPageNum)}
                              pageSize={pageSize}
                            />
                          </Col>
                        </Row>
                      </>
                    ) : (
                      <>
                        <Alert color='primary'>
                          {userSearch.length
                            ? t('user.searchAlert', {
                                userSearch: userSearch.replace(/%20/g, ' ')
                              })
                            : t('user.noUserAddedAlert')}
                        </Alert>
                      </>
                    )}
                  </>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
      {locationModalOpen ? (
        <LocationModal
          key={'add-invoice-address'}
          isOpen={locationModalOpen}
          onToggle={toggleLocationModal}
          directoryId={''}
          editLocation={editLocation}
          onLocationCreated={() => {
            updateQueryString({
              locationPage: 1
            })
            getLocations(locationSearch, parseInt(locationPageNum))
            setEditLocation({})
          }}
        />
      ) : null}
      {invoiceLocationModalOpen ? (
        <LocationModal
          key={'edit-invoice-address'}
          isOpen={invoiceLocationModalOpen}
          onToggle={toggleInvoiceLocationModal}
          directoryId={''}
          editLocation={editLocation}
          onLocationCreated={() => {
            setEditLocation({})
            setEditInvoiceAddress(false)
            onAdminUpdated()
            getLocations(locationSearch, parseInt(locationPageNum))
          }}
          invoiceAddress={editInvoiceAddress}
        />
      ) : null}
      {deleteLocationModalOpen && (
        <CustomModal
          header={
            <>
              <span className='danger-text'>{t('location.warning')}</span>:{' '}
              {t('location.deleteLocationHeader')}
            </>
          }
          body={
            <>
              <p>
                {t('location.deleteOptionMessage')}{' '}
                <strong>{deleteLocationName}</strong> ?
              </p>
            </>
          }
          isOpen={deleteLocationModalOpen}
          loading={loading}
          onToggle={() => setDeleteLocationModalOpen(!deleteLocationModalOpen)}
          onPositiveAction={() => deleteLocation(deleteLocationId)}
          positiveActionText='Delete'
          onNegativeAction={() => {
            setDeleteLocationId('')
            setDeleteLocationModalOpen(false)
          }}
          negativeActionText='Cancel'
          isPostiveActionButtonComeFirst={true}
        />
      )}

      {disableUserModalOpen && (
        <CustomModal
          header='Confirm'
          body={`${t('user.disableOptionMessage')}`}
          isOpen={disableUserModalOpen}
          loading={loading}
          onToggle={() => setDisableUserModalOpen(!disableUserModalOpen)}
          onPositiveAction={() => disableUserhandler(disableUser)}
          positiveActionText='Yes'
          onNegativeAction={() => {
            setDisableUser(null)
            setDisableUserModalOpen(false)
          }}
          negativeActionText='No'
        />
      )}
      {resendInviteModalOpen && (
        <CustomModal
          header={t('generic.confirm')}
          body={`${t('invitation.resendInviteOptionMessage')}`}
          isOpen={resendInviteModalOpen}
          loading={loading}
          onToggle={() => setResendInviteModalOpen(!resendInviteModalOpen)}
          onPositiveAction={() => resendInvite()}
          positiveActionText={t('generic.yes')}
          onNegativeAction={() => {
            setResendInviteId('')
            setResendInviteModalOpen(false)
          }}
          negativeActionText={t('generic.no')}
        />
      )}
      <Modal isOpen={userModalOpen} size='lg'>
        <UserModal
          editUser={editUser}
          onUserSaved={() => {
            updateQueryString({
              userPage: 1
            })
            getUsers(userSearch, parseInt(userPageNum))
            setEditUser(null)
          }}
          onToggle={toggleUserModal}
          companyName={organisation.name}
        />
      </Modal>
      <Modal isOpen={taxModalOpen} size='lg'>
        <TaxModal
          onToggle={toggleTaxModal}
          directory={organisation}
          onTaxCreated={() => onAdminUpdated()}
        />
      </Modal>
      <Modal isOpen={companySetupModalOpen} size='lg'>
        <CompanySetupModal
          organisation={organisation}
          onClose={handleClosingCompanySetup}
        />
      </Modal>
    </div>
  )
}

export default OrganisationSettings
