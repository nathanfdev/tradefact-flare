import { Position } from '../../../packages/tradefact-objects/shipment'
import { Device } from '../../../packages/tradefact-objects/order'
import {
  MAP_ICON_WIDTH,
  MAP_ICON_HEIGHT,
  MAP_ICON_ANCHOR_X,
  MAP_ICON_ANCHOR_Y,
  clusteringOptions
} from './map-consts'
import { activeMarkerSvg, redactiveMarkerSvg } from './map-svgs'
import { get } from 'lodash'
import { createBubbleTemplate } from './map-templates'
import { store } from '../../../components/app/store'
import { saveMapState } from '../../../reducers/map-view-slice'

export interface MarkerCreation {
  position: Position
  min?: number
  max?: number
  weight?: string | undefined
  visibility?: boolean
  id?: string
  isHighlighted?: boolean
  isPending?: boolean
}

export interface ClusterData {
  clusterData: Device[]
  max: number
  min: number
  weight: string
}

export interface ClusterTheme {
  (hoverID: string): {
    getClusterPresentation: (cluster: any) => any
    getNoisePresentation: (noisePoint: any) => any
  }
}

export interface ClusterParams {
  map: any
  data: Device[]
  theme: ClusterTheme
  hoverID: string | undefined
  ui: any
  handleSelectDevice: any
}

export const removeAllObjects = (map: any) => {
  if (map.getObjects().length > 0) {
    map.removeObjects(map.getObjects())
  }
}
let zIndex = 1
// Determines which SVG to use and returns a marker with device/cluster data attached
export const createMarkerWithIcon = ({
  position,
  min,
  max,
  weight,
  isHighlighted
}: MarkerCreation) => {
  const svg = isHighlighted
    ? redactiveMarkerSvg(weight)
    : activeMarkerSvg(weight)
  const icon = new window.H.map.Icon(svg, {
    size: { w: MAP_ICON_WIDTH, h: MAP_ICON_HEIGHT },
    anchor: { x: MAP_ICON_ANCHOR_X, y: MAP_ICON_ANCHOR_Y }
  })
  if (isHighlighted) {
    const marker = new window.H.map.Marker(position, {
      icon,
      min,
      max,
      zIndex: zIndex++
    })
    return marker
  } else {
    const marker = new window.H.map.Marker(position, {
      icon,
      min,
      max,
      zIndex: 1
    })

    // store.dispatch(saveMapState({ target: 'marker', value: position }))
    return marker
  }
}

// Generates markup for the tooltip (bubble) that gets attached to the marker click event
export const createBubble = (
  data: Device[],
  position: Position,
  index?: number
) => {
  const template = createBubbleTemplate(data, index)

  const bubble = new window.H.ui.InfoBubble(position, {
    content: template,
    onStateChange: function(evt: any) {
      if (evt.target.getState() === window.H.ui.InfoBubble.State.CLOSED) {
        // map.removeObjects(destinationObjects)
        // destinationObjects = []
      }
    }
  })

  return bubble
}

// Required Heremap helper function
const getDataPoints = (cluster: any) => {
  const dataPoints: any = []
  cluster.forEachDataPoint(dataPoints.push.bind(dataPoints))
  return dataPoints
}

// Tests whether any device within a cluster is currently being selected
const testClusterForHoverID = (id: string, data: ClusterData) => {
  return data.clusterData.some(
    coord => coord.orderId === id || coord.deviceId === id
  )
}

// Attaches the shipment data to the marker and returns the cluster layer
// Cluster presentations = clustered markers
// Noise presentations = unclustered, single markers
export const clusterTheme = (hoverID: string) => ({
  getClusterPresentation: function(cluster: any) {
    const dataPoints = getDataPoints(cluster)
    const clusteredData: Device[] = dataPoints.map((d: any) => d.getData())
    const weight = cluster.getWeight()

    // Create clustered data
    const data = {
      clusterData: clusteredData,
      weight: weight.toString(),
      min: cluster.getMinZoom(),
      max: cluster.getMaxZoom()
    }

    const clusterMarker = createMarkerWithIcon({
      weight: weight.toString(),
      position: cluster.getPosition(),
      min: cluster.getMinZoom(),
      max: cluster.getMaxZoom(),
      isHighlighted: testClusterForHoverID(hoverID, data),
      isPending: clusteredData.every(
        coord => coord.status === 'AwaitingFulfillment'
      )
    })

    clusterMarker.setData(data)
    return clusterMarker
  },
  getNoisePresentation: function(noisePoint: any) {
    const data: Device = noisePoint.getData()

    const noiseMarker = createMarkerWithIcon({
      position: noisePoint.getPosition(),
      min: noisePoint.getMinZoom(),
      isHighlighted: data.orderId === hoverID || data.deviceId === hoverID,
      isPending: data.status === 'AwaitingFulfillment'
    })

    noiseMarker.setData(data)
    return noiseMarker
  }
})

// Builds the cluster layer and attaches it to the map
// We then return any modifying functions to be called by the root useEffect. Do not recall this function as it detaches then reattaches the cluster layer which is not performant
export const startClustering = ({
  map,
  data,
  theme,
  hoverID,
  ui,
  handleSelectDevice
}: ClusterParams) => {
  const dataPoints = data.map(
    (item: Device) =>
      new window.H.clustering.DataPoint(item.lat, item.lng, null, item)
  )
  const clusteredDataProvider = new window.H.clustering.Provider(dataPoints, {
    clusteringOptions,
    theme: theme(hoverID || '')
  })
  const clusteringLayer = new window.H.map.layer.ObjectLayer(
    clusteredDataProvider
  )

  map.addEventListener(
    'pointermove',
    function(event: any) {
      if (event.target instanceof window.H.map.Marker) {
        map.getViewPort().element.style.cursor = 'pointer'
      } else {
        map.getViewPort().element.style.cursor = 'auto'
      }
    },
    false
  )

  map.addEventListener('tap', (event: any) => {
    ui.getBubbles().forEach((bubble: any) => ui.removeBubble(bubble)) // close any existing tooltips

    if (map.getObjects().length > 0) {
      // pretty certain this does nothing
      map.removeObjects(map.getObjects())
    }

    if (get(event, 'target.data')) {
      const data = event.target.getData()
      const position = event.target.getGeometry()

      if (data.clusterData) {
        const state = store.getState()
        const { selectedDevice } = state.orderMapView
        let index

        if (selectedDevice) {
          // We can preset which tab gets displayed during a synthetic tap event by using the
          // index of the saved selectedDevice
          const deviceIndex = data.clusterData.findIndex(
            (d: Device) => d.deviceId === selectedDevice.deviceId
          )
          if (deviceIndex !== -1) index = deviceIndex
        } else {
          // This will run for normal tap events
          store.dispatch(
            saveMapState({
              target: 'selectedDevice',
              value: data.clusterData[0]
            })
          )
        }
        const bubble = createBubble(data.clusterData, position, index)
        ui.addBubble(bubble)
      } else {
        const bubble = createBubble([data], position)

        // Device selection occurs here for noise tap rather that on the handleSelectDevice function
        // because we don't need to extract the device index from the cluster data
        store.dispatch(saveMapState({ target: 'selectedDevice', value: data }))
        ui.addBubble(bubble)
      }

      // Recenter on the tap event
      // Animations are set to "false" but they're currently broken
      const viewModel = map.getViewModel()
      viewModel.setLookAtData(
        {
          position,
          zoom: map.getZoom()
        },
        false
      )
    } else {
      handleSelectDevice(null) // deselect any stored device IDs
    }
  })

  // Export the callback to update the cluster theme i.e. when hovering over the sidebar
  const highlightClusters = (id: string) => {
    clusteredDataProvider.setTheme(theme(id))
  }

  const updateClusters = (data: Device[]) => {
    ui.getBubbles().forEach((bubble: any) => ui.removeBubble(bubble))

    const dataPoints = data
      .filter(coord => coord.isSelected)
      .map(
        (item: Device) =>
          new window.H.clustering.DataPoint(item.lat, item.lng, null, item)
      )
    clusteredDataProvider.setDataPoints(dataPoints)
  }

  map.addLayer(clusteringLayer)

  return {
    clusteredDataProvider,
    clusteringLayer,
    highlightClusters,
    updateClusters
  }
}
