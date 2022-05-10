import { ShipmentType } from '../packages/tradefact-objects'
export const getExtension = (name: string) => {
  const extension = name.split('.').pop() || ''
  return extension.toLowerCase()
}

export const shipmentIcon = (type: ShipmentType) => {
  let icon = ''
  switch (type) {
    case 1:
      icon = 'fad fa-ship'
      break
    case 2:
      icon = 'fas fa-plane'
      break
    case 3:
      icon = 'fas fa-truck'
      break
    default:
      icon = 'fas fa-taxi'
  }
  return icon
}

export const convertTemprature = (temp: any) => {
  const fahrenheit = ((temp * 9) / 5 + 32).toFixed(2)
  return `${fahrenheit}°F`
}
