import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { Collapse } from 'reactstrap'
import { Device, FilteredOrder } from '../../packages/tradefact-objects/order'
import {
  toggleDevice,
  toggleOrder
} from '../../routes/dashboard/reducer/order-slice'
import { useAppDispatch, useAppSelector } from '../app'
import { useDebouncedEffect } from '../../helpers/useDebouncedEffect'
import { saveMapState } from '../../reducers/map-view-slice'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

interface OrderProps {
  order: FilteredOrder
  provider: any
}

export default function SidebarOrder({ order, provider }: OrderProps) {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const expanderRef = useRef<HTMLButtonElement>(null)
  const [expanded, setExpanded] = useState<boolean>(false)
  const [hoverID, setHoverID] = useState<string>('')
  const orderIsChecked = order.deviceList.map(i => i.isSelected).includes(true)
  const handleExpand = () => setExpanded(!expanded)
  const flipChevron = expanded ? 'fal fa-chevron-up' : 'fal fa-chevron-down'

  const { selectedDevice } = useAppSelector(state => state.orderMapView)

  // We route the clustering provider through here, round up the markers using getBoundingBox,
  // then hunt through the returned array for the marker to simulate a tap event
  const handleSelectDevice = (value: Device) => {
    const box = provider.cluster.getRootGroup().getBoundingBox()
    const zoom = provider.map.getZoom()
    const markers = provider.cluster.requestMarkers(box, zoom, true)
    const noise = markers.find((m: any) => m.data.deviceId === value.deviceId)

    if (noise) {
      noise.dispatchEvent('tap')
    } else {
      const clusterArr: any = markers
        .filter((m: any) => m.data.clusterData)
        .filter((m: any) =>
          m.data.clusterData.find((d: Device) => d.deviceId === value.deviceId)
        )

      // We need to pick out the last marker from the list as map is returning all markers,
      // including hidden ones
      const cluster: any = _.last(clusterArr)

      if (cluster) {
        // Save this device so we can use the index in the cluster tap callback
        dispatch(saveMapState({ target: 'selectedDevice', value }))
        cluster.dispatchEvent('tap')
      }
    }
  }

  const handleCheck = (
    e: React.MouseEvent,
    type: 'device' | 'order',
    id: string
  ) => {
    e.stopPropagation()
    if (type === 'order') dispatch(toggleOrder(id))
    else if (type === 'device') dispatch(toggleDevice(id))
  }

  const handleHover = (e: React.MouseEvent) => {
    if (e.type === 'mouseenter') {
      setHoverID(e.currentTarget.id)
    } else setHoverID('')
  }

  // Debounce the dispatch event to prevent overloading the map which causes flashes
  useDebouncedEffect(
    () => dispatch(saveMapState({ target: 'hoverID', value: hoverID })),
    [hoverID],
    250
  )

  // Listen for device selection event caused by tapping the map
  // Then simulate a click to expand the order box
  useEffect(() => {
    if (expanderRef.current && !expanded) {
      if (selectedDevice?.orderId === order.id) {
        expanderRef.current.dispatchEvent(
          new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            button: 1
          })
        )
      }
    }
  }, [selectedDevice])

  const orderClasses = classNames({
    'sidebar-order-box': true,
    'sidebar-hover': !expanded
  })

  return (
    <div className={orderClasses}>
      <div
        onMouseEnter={handleHover}
        onMouseLeave={handleHover}
        id={order.id}
        onClick={handleExpand}
      >
        <input
          type='checkbox'
          checked={orderIsChecked}
          onChange={() => {}} // to satisfy react
          onClick={e => handleCheck(e, 'order', order.id)}
        />
        <label>{order.reference || t('generic.unnamed')}</label>
        <div className='sidebar-expander'>
          <i className={flipChevron} ref={expanderRef} />
        </div>
      </div>
      <Collapse isOpen={expanded}>
        {order.deviceList.map((device: Device, i) => (
          <div
            key={i}
            className={classNames({
              'sidebar-device': true,
              'sidebar-highlighted':
                selectedDevice?.deviceId === device.deviceId
            })}
            onMouseEnter={handleHover}
            onMouseLeave={handleHover}
            onClick={() => handleSelectDevice(device)}
            id={device.deviceId}
          >
            <input
              type='checkbox'
              checked={device.isSelected}
              onChange={() => {}} // to satisfy react
              onClick={e => handleCheck(e, 'device', device.deviceId)}
            />
            <label>{device.deviceLabel || t('generic.unnamed')}</label>
          </div>
        ))}
      </Collapse>
    </div>
  )
}
