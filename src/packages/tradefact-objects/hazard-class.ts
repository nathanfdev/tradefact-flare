export interface HazardClass {
  class: string
}

export interface HazardClassInfo {
  class: string
  division: string
  name: string
}

export enum HazardContents {
  NONE = '0',
  LITHIUM_BATTERIES = '1',
  MAGNETIC_PROPERTIES = '2',
  HAZARDOUS_MATERIALS = '3'
}
