import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../components/app'
import { Device } from '../../../packages/tradefact-objects/order'
import { saveMapState } from '../../../reducers/map-view-slice'
import { clusterTheme, startClustering } from './map-functions'

export const MapWidget = ({
  hoverID,
  handleSetProvider
}: {
  hoverID?: string
  handleSetProvider: any
}) => {
  const mapRef = useRef(null)
  const blankmapRef = useRef(null)
  const dispatch = useAppDispatch()
  const [currentMap, setCurrentMap] = useState<any>(null)
  const [clusterProvider, setClusterProvider] = useState<any>(null)
  const { coordinateList } = useAppSelector(state => state.order)
  const H = window.H
  const platform = new H.service.Platform({
    apikey: process.env.HERE_KEY,
    useHTTPS: true
  })
  const defaultLayers = platform.createDefaultLayers()
  const mapOptions = {
    center: { lat: 6.6111, lng: 20.9394 },
    zoom: 2.31,
    minZoom: 2.31,
    pixelRatio: window.devicePixelRatio || 1,
    renderBaseBackground: { lower: 0, higher: 2 },
    fixedCenter: true,
    noWrap: true
  }

  const handleSelectDevice = (value: Device) => {
    dispatch(saveMapState({ target: 'selectedDevice', value }))
  }

  useEffect(() => {
    if (!mapRef.current) {
      if (!blankmapRef.current) return
      const map = new H.Map(
        blankmapRef.current,
        defaultLayers.vector.normal.map,
        mapOptions
      )
      return map
    } else {
      const map = new H.Map(
        mapRef.current,
        defaultLayers.vector.normal.map,
        mapOptions
      )

      // Set the max zoom level
      map.getBaseLayer().setMax(9)

      setCurrentMap(map)
      const events = new window.H.mapevents.MapEvents(map)
      new window.H.mapevents.Behavior(events)
      const ui = window.H.ui.UI.createDefault(map, defaultLayers)
      window.addEventListener('resize', () => map.getViewPort().resize())

      if (coordinateList !== []) {
        const provider = startClustering({
          map,
          data: coordinateList as Device[],
          theme: clusterTheme,
          hoverID,
          ui,
          handleSelectDevice
        })
        setClusterProvider(provider)
      }
      return () => {
        map.dispose()
      }
    }
  }, [mapRef])

  useEffect(() => {
    if (currentMap && hoverID !== undefined) {
      clusterProvider.highlightClusters(hoverID)
    }
  }, [hoverID])

  useEffect(() => {
    if (currentMap) {
      clusterProvider.updateClusters(coordinateList)
    }
  }, [coordinateList])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (clusterProvider?.clusteredDataProvider) {
        handleSetProvider({
          cluster: clusterProvider?.clusteredDataProvider,
          map: currentMap
        })
      }
    }, 2000)

    return () => {
      clearTimeout(timer)
    }
  }, [clusterProvider])

  return <div className='order-map w-100 m-0' ref={mapRef} />
}
