import { Container } from './all'
import { CargoItem, createCargoItemList } from './cargo-item'

export interface FCLItem {
  cargoItems?: Array<CargoItem>
  containerType?: string
  hazardCode?: string
}

export const convertContainerToFCLItem = (container: Container): FCLItem => {
  return {
    cargoItems: createCargoItemList(container.products),
    containerType: container.size,
    hazardCode: container.hazardCode
  }
}

export const createFCLItemList = (containers: Container[]): FCLItem[] => {
  return containers.map(container => convertContainerToFCLItem(container))
}
