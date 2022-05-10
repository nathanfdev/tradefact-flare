import FileSaver from 'file-saver'
import moment from 'moment'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import api from '../../packages/tradefact-api'
import { toast } from '../../helpers'
import {
  UncontrolledTooltip,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  Table,
  UncontrolledButtonDropdown
} from 'reactstrap'
import { convertTemprature } from '../../helpers/common'
import { AllOrder, OrderLineItem } from '../../packages/tradefact-objects/order'
import { useAppDispatch, useAppSelector } from '../app'
import {
  completeOrder,
  getListOrders,
  getOrderTrackingUrl,
  getDeviceTrackingUrl
} from '../../packages/tradefact-api/order'

interface OrderListItemProps {
  expanded: boolean
  handleExpansion: (e: React.MouseEvent) => void
  order: AllOrder
  userPreferences: any
  showHeaders: boolean
}

export const OrderListItem = ({
  expanded,
  handleExpansion,
  order,
  userPreferences,
  showHeaders
}: OrderListItemProps) => {
  const flipChevron = expanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down'
  const tableHeaders = [
    'device',
    'deviceId',
    'lastUpdate',
    'battery',
    'tempHumidity'
  ]

  const { t } = useTranslation()
  const isMobile = useMediaQuery({ query: '(max-width: 991px)' })
  const dispatch = useAppDispatch()
  const { userInfo } = useAppSelector(state => state.user)
  const { deviceFilterStatus } = useAppSelector(state => state.orderListView)
  const copyOrderTrackingUrl = async (id: string) => {
    return await getOrderTrackingUrl(id)
      .then(res => {
        navigator.clipboard.writeText(res.linkUri)
      })
      .catch(() =>
        toast('Something went wrong', {
          title: 'Error',
          icon: 'danger'
        })
      )
  }

  const markOrderCompleted = (id: string) => {
    dispatch(completeOrder(id)).then(res => {
      if (!res.payload) {
        toast(t('validation.genericToastErrorMessage'), {
          title: t('generic.error'),
          icon: 'danger'
        })
      } else {
        dispatch(getListOrders({ userInfo }))
        toast(t('list.orderCompleteToast'), {
          title: t('generic.success'),
          icon: 'success'
        })
      }
    })
  }

  const OrderStatusIndicator = ({ orderStatus }: { orderStatus: string }) => {
    return (
      <div className='mx-4 pb-2 d-flex align-items-center table-border grey-color f6 font-italic'>
        {orderStatus === 'TrackingActive' && (
          <span>
            <i className='fas fa-map-marker-alt' /> {t('generic.active')}
          </span>
        )}
        {orderStatus === 'TrackingComplete' && (
          <span>
            <i className='fas fa-check' /> {t('generic.completed')}
          </span>
        )}
        {orderStatus === 'AwaitingFulfillment' && (
          <span>
            <i className='fas fa-hourglass-start' /> {t('generic.awaiting')}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className='pt-3 pb-1 bg-white order-list-item mb-2'>
      {showHeaders &&
        (deviceFilterStatus === '' || deviceFilterStatus == 3) && (
          <OrderStatusIndicator orderStatus={order.orderStatus} />
        )}

      <div
        className={`px-4 py-2 d-flex align-items-center justify-content-between ${expanded &&
          'table-border'}`}
      >
        <div className='d-flex flex-row  w-75 justify-content-start  align-items-center'>
          <div className='d-flex flex-column align-items-start w-25'>
            <h6 className='mb-0 mr-4 f8 font-weight600'>
              {order.shipmentName ? order.shipmentName : t('generic.unkown')}
            </h6>
            <p className='f9 grey-color pt-2'>
              {order.referenceNumber
                ? ` (${t('map.reference')}: ${order.referenceNumber})`
                : ` (${t('map.reference')}: ${t('generic.notAvailable')}) `}
            </p>
          </div>
          <div className='d-flex flex-column w-17'>
            <h6 className='mb-0 mr-4 f9 font-weight600'>
              {t('map.dateOrdered')}
            </h6>
            <p className='f6 font-weight-normal  pt-2'>
              {moment(order.orderDate).format('L')}
            </p>
          </div>
          <div className='d-flex flex-column w-17'>
            <h6 className='mb-0 mr-4 f9 font-weight600'>
              {t('map.shipmentDate')}
            </h6>
            <p className='f6 font-weight-normal pt-2'>
              {moment(order.shipmentDate).format('L')}
            </p>
          </div>
          <div className='d-flex flex-column w-75'>
            <h6 className='mb-0 mr-4 f9 font-weight600'>
              {t('map.trackingFromTo')}
            </h6>
            <p className='f6 font-weight-normal pt-2'>
              <span
                className='f6'
                id={`deliveryAddress-${order.deliveryAddress.id}${order.id}`}
              >
                {order.deliveryAddress.country.name}
              </span>
              <i className='fas fa-long-arrow-alt-right mx-2'></i>
              <span
                className='f6'
                id={`destinationAddress-${order.destinationAddress.id}-${order.id}`}
              >
                {order.destinationAddress.country.name}
              </span>
            </p>

            <UncontrolledTooltip
              className='quotes-hover-tooltip'
              placement='bottom'
              target={`deliveryAddress-${order.deliveryAddress.id}${order.id}`}
            >
              <div className='custom-tooltip-item'>
                <p className='mb-2 addres-name'>
                  <i className='fas fa-map-marker-alt text-primary mr-2'></i>
                  {order.deliveryAddress.name}
                </p>{' '}
                <div className='pl-3'>
                  <p className='mb-0 '>
                    {order.deliveryAddress.addressLine1}{' '}
                    {order.deliveryAddress.addressLine2 &&
                      order.deliveryAddress.addressLine2}
                  </p>
                  {order.deliveryAddress.addressLine3 && (
                    <p className='mb-0'>
                      {order.deliveryAddress?.addressLine3}
                    </p>
                  )}
                  <p className='mb-0'>{order.deliveryAddress?.city}</p>
                  {order.deliveryAddress?.county && (
                    <p className='mb-0'>{order.deliveryAddress?.county}</p>
                  )}
                  <p className='mb-0'>{order.deliveryAddress?.country?.name}</p>
                  <p>{order.deliveryAddress.postalCode}</p>
                </div>
              </div>
            </UncontrolledTooltip>
            <UncontrolledTooltip
              className='quotes-hover-tooltip'
              placement='bottom'
              target={`destinationAddress-${order.destinationAddress.id}-${order.id}`}
            >
              <div className='custom-tooltip-item'>
                <p className='mb-2 addres-name'>
                  <i className='fas fa-map-marker-alt text-primary mr-2'></i>
                  {order.destinationAddress.name}
                </p>{' '}
                <div className='pl-3'>
                  <p className='mb-0'>
                    {order.destinationAddress.addressLine1}{' '}
                    {order.destinationAddress.addressLine2 &&
                      order.destinationAddress.addressLine2}
                  </p>
                  {order.destinationAddress.addressLine3 && (
                    <p className='mb-0'>
                      {order.destinationAddress?.addressLine3}
                    </p>
                  )}
                  <p className='mb-0'>{order.destinationAddress?.city}</p>
                  {order.deliveryAddress?.county && (
                    <p className='mb-0'>{order.destinationAddress?.county}</p>
                  )}
                  <p className='mb-0'>
                    {order.destinationAddress?.country?.name}
                  </p>
                  <p>{order.destinationAddress.postalCode}</p>
                </div>
              </div>
            </UncontrolledTooltip>
          </div>
        </div>
        <div className='d-flex align-items-center justify-content-between w-20'>
          <div className='d-flex flex-column pt-2 pr-2'>
            <h6 className='mb-0 mr-4 f9 font-weight600'>
              {t('generic.orderedBy')}:{' '}
            </h6>
            <p className='f6 font-weight-normal pt-2'>
              {order?.orderedBy ? order.orderedBy : t('generic.notAvailable')}
            </p>
          </div>
          <div className='pr-2'>
            <UncontrolledDropdown className='account-dropdown'>
              {isMobile ? (
                <DropdownToggle className='rounded-container'>
                  <i className='far fa-filter'></i>
                </DropdownToggle>
              ) : (
                <DropdownToggle className='rounded-container w-100 py-2'>
                  <div className='d-flex align-items-center justify-content-between'>
                    <div>
                      <p className='text-capitalize normal-font'>
                        {t('generic.action')}
                      </p>
                    </div>
                    <div>
                      <i className='fal fa-chevron-down ml-3' />
                    </div>
                  </div>
                </DropdownToggle>
              )}
              <DropdownMenu right>
                <DropdownItem onClick={() => copyOrderTrackingUrl(order.id)}>
                  <div className='d-flex justify-content-between text-align-center w-100 py-2'>
                    <div>{t('generic.copyTrackingLink')}</div>
                    <div>
                      <i className='far fa-copy secondary-color pl-2'></i>
                    </div>
                  </div>
                </DropdownItem>
                {order.orderStatus !== 'TrackingComplete' && (
                  <DropdownItem onClick={() => markOrderCompleted(order.id)}>
                    <div className='d-flex justify-content-between text-align-center w-100 py-2'>
                      <div>{t('map.markComplete')}</div>
                      <div>
                        <i className='far fa-check secondary-color'></i>
                      </div>
                    </div>
                  </DropdownItem>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
          <div
            id={order.id}
            onClick={handleExpansion}
            className='btn-outline-secondary btn account-dropdown collapse-button'
          >
            <i style={{ pointerEvents: 'none' }} className={flipChevron}></i>
          </div>
        </div>
      </div>
      <Collapse isOpen={expanded} className='px-4 mt-4 table-responsive'>
        <Table>
          <thead className='font-weight600'>
            <tr className='font-weight600'>
              {tableHeaders.map((x, i) => (
                <th className='font-weight600' key={i}>
                  {t(`map.tableHeaders.${x}`)}
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {order.lineItems.map((device: OrderLineItem, i) => (
              <OrderListFlareEntry
                key={i}
                device={device}
                orderStatus={order.orderStatus}
                userPreferences={userPreferences}
              />
            ))}
          </tbody>
        </Table>
      </Collapse>
    </div>
  )
}

// Each flare = a row in the order table
const OrderListFlareEntry = ({
  device,
  orderStatus,
  userPreferences
}: {
  device: OrderLineItem
  orderStatus: string
  userPreferences: any
}) => {
  const { t } = useTranslation()
  const { lastDeviceReport } = device?.device ?? 'Unkown'
  const downloadCsv = (id: string) => {
    api
      .downloadCsvReport(id)
      .then(result => FileSaver.saveAs(result, 'DeviceReport.csv'))
      .catch(() =>
        toast('Something went wrong', {
          title: 'Error',
          icon: 'danger'
        })
      )
  }
  const copyDeviceTrackingUrl = async (id: string) => {
    return await getDeviceTrackingUrl(id)
      .then(res => {
        navigator.clipboard.writeText(res.linkUri)
      })
      .catch(() =>
        toast('Something went wrong', {
          title: 'Error',
          icon: 'danger'
        })
      )
  }

  const NotApplicableTag = () => {
    return (
      <div className='mx-4 pb-2 d-flex align-items-center grey-color f6 font-italic'>
        <i className='fas fa-hourglass-start mr-2' />
        {t('generic.notYetDispatched')}
      </div>
    )
  }

  return (
    <tr>
      <td>
        <div className='d-flex flex-column'>
          <span>{device.labelText} </span>
        </div>
      </td>
      <td>
        <div className='d-flex flex-column'>
          <span>
            {orderStatus === 'AwaitingFulfillment'
              ? 'Pending'
              : device?.device?.deviceId ?? t('generic.notAvailable')}
          </span>
        </div>
      </td>
      <td>
        <div className='d-flex flex-column'>
          <span>
            {orderStatus === 'AwaitingFulfillment' ? (
              <NotApplicableTag />
            ) : (
              moment(lastDeviceReport?.gpsTime).format('DD/MM/YYYY - HH:mm')
            )}
          </span>
        </div>
      </td>
      <td>
        <span>
          {orderStatus === 'AwaitingFulfillment' ? (
            <NotApplicableTag />
          ) : (
            `${lastDeviceReport?.battery}%` ?? t('generic.notAvailable')
          )}
        </span>
      </td>
      <td>
        <span>
          {orderStatus === 'AwaitingFulfillment' ? (
            <NotApplicableTag />
          ) : lastDeviceReport?.temperature ? (
            userPreferences.tempratureUnit === 'Degrees Fahrenheit (°F)' ? (
              convertTemprature(lastDeviceReport?.temperature)
            ) : (
              `${lastDeviceReport?.temperature.toFixed(2)}°C`
            )
          ) : (
            t('generic.notAvailable')
          )}
          {orderStatus === 'AwaitingFulfillment'
            ? ''
            : lastDeviceReport?.humidity
            ? `/ ${lastDeviceReport?.humidity}`
            : t('generic.notAvailable')}
        </span>
      </td>
      {orderStatus !== 'AwaitingFulfillment' && (
        <td>
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
                onClick={() => copyDeviceTrackingUrl(device.device.deviceId)}
              >
                {t('generic.shareFlare')}
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  downloadCsv(device?.device?.deviceId)
                }}
              >
                {t('generic.download')}
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </td>
      )}
    </tr>
  )
}
