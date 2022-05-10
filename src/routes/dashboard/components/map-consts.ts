export const MAP_ICON_WIDTH = 36
export const MAP_ICON_HEIGHT = 42
export const MAP_ICON_ANCHOR_X = MAP_ICON_WIDTH / 2
export const MAP_ICON_ANCHOR_Y = MAP_ICON_HEIGHT

const MAP_CLUSTER_RADIUS = 32
const MAP_CLUSTER_MIN_WEIGHT = 2
const MAP_CLUSTER_MIN_PTS = 1

export const clusteringOptions = {
  eps: MAP_CLUSTER_RADIUS,
  minWeight: MAP_CLUSTER_MIN_WEIGHT,
  minPts: MAP_CLUSTER_MIN_PTS,
  strategy: window.H.clustering.Provider.Strategy.GRID
}
