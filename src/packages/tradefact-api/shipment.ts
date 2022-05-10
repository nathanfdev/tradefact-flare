import { fetchFromApi } from '.'
import {
  AISTrackingResult,
  BookingsPageMode,
  CargoItem,
  MinimalShipment,
  Page,
  RouteSchedule,
  ShipmentCreateRequest,
  TrackingInfo,
  TransitInformation,
  ValidateContainerResponse
} from '../tradefact-objects'
import { AirlineList, TrackingResource } from '../tradefact-objects/shipment'

export const listForwarderShipments = async (
  mode: BookingsPageMode,
  search?: string,
  shipmentStatus?: string,
  shipmentMethod?: number,
  pageNumber?: number,
  pageSize?: number
): Promise<Page<MinimalShipment>> => {
  pageSize = pageSize ?? 10
  pageNumber = pageNumber ?? 1
  const hasException = mode === BookingsPageMode.exception
  const activeOnly = mode === BookingsPageMode.active
  const completed = mode === BookingsPageMode.completed
  if (shipmentStatus) {
    if (shipmentMethod === -1) {
      return fetchFromApi(
        `/partner/shipments`,
        {
          search,
          shipmentStatus,
          pageNumber,
          pageSize,
          hasException,
          activeOnly
        },
        {
          method: 'GET'
        }
      )
    }
    return fetchFromApi(
      `/partner/shipments`,
      {
        search,
        shipmentStatus,
        shipmentMethod,
        pageNumber,
        pageSize,
        hasException,
        activeOnly
      },
      {
        method: 'GET'
      }
    )
  } else {
    if (shipmentMethod === -1) {
      return fetchFromApi(
        `/partner/shipments`,
        {
          search,
          shipmentStatus,
          pageNumber,
          pageSize,
          activeOnly,
          hasException,
          completed
        },
        {
          method: 'GET'
        }
      )
    }
    return fetchFromApi(
      `/partner/shipments`,
      {
        search,
        shipmentStatus,
        shipmentMethod,
        pageNumber,
        pageSize,
        activeOnly,
        hasException,
        completed
      },
      {
        method: 'GET'
      }
    )
  }
}

export const listShipperShipments = async (
  mode: BookingsPageMode,
  search?: string,
  shipmentStatus?: string,
  shipmentMethod?: number,
  pageNumber?: number,
  pageSize?: number,
  createdByMe?: boolean,
  ShowExceptionDetailsOnly?: boolean,
  hasGeoCoordinates?: boolean
): Promise<Page<MinimalShipment>> => {
  pageSize = pageSize ?? 10
  pageNumber = pageNumber ?? 1
  const hasException = mode === BookingsPageMode.exception
  const activeOnly = mode === BookingsPageMode.active
  const completed = mode === BookingsPageMode.completed
  if (shipmentStatus) {
    if (shipmentMethod === -1) {
      return fetchFromApi(
        `/shipper/shipments`,
        {
          search,
          shipmentStatus,
          pageNumber,
          pageSize,
          createdByMe,
          hasException,
          activeOnly
        },
        {
          method: 'GET'
        }
      )
    }
    return fetchFromApi(
      `/shipper/shipments`,
      {
        search,
        shipmentStatus,
        shipmentMethod,
        pageNumber,
        pageSize,
        createdByMe,
        hasException,
        activeOnly
      },
      {
        method: 'GET'
      }
    )
  } else {
    if (shipmentMethod === -1) {
      return fetchFromApi(
        `/shipper/shipments`,
        {
          search,
          shipmentStatus,
          pageNumber,
          pageSize,
          activeOnly,
          hasException,
          completed,
          createdByMe
        },
        {
          method: 'GET'
        }
      )
    }
    return fetchFromApi(
      `/shipper/shipments`,
      {
        search,
        shipmentStatus,
        shipmentMethod,
        pageNumber,
        pageSize,
        activeOnly,
        hasException,
        completed,
        createdByMe,
        ShowExceptionDetailsOnly,
        hasGeoCoordinates
      },
      {
        method: 'GET'
      }
    )
  }
}

export const getShipperShipment = (id: string): Promise<MinimalShipment> =>
  fetchFromApi(`/shipper/shipments/${id}`, undefined, {
    method: 'GET'
  })

export const getPartnerShipment = (id: string): Promise<MinimalShipment> =>
  fetchFromApi(`/partner/shipments/${id}`, undefined, {
    method: 'GET'
  })

export const submitShipment = (body: ShipmentCreateRequest): Promise<void> =>
  fetchFromApi('/shipper/shipment', undefined, {
    method: 'POST',
    body: JSON.stringify(body)
  })

export const updateTags = (
  tags: string[],
  shipmentId: string
): Promise<string[]> => {
  return fetchFromApi('/shipper/shipment/updatetags', undefined, {
    method: 'POST',
    body: JSON.stringify({
      shipmentId: shipmentId,
      tags: tags
    })
  })
}

export const assignCollectionDate = (
  shipmentId: string,
  collectionDate: Date
): Promise<void> =>
  fetchFromApi('/partner/shipments/assigncollectiondate', undefined, {
    method: 'POST',
    body: JSON.stringify({
      shipmentId: shipmentId,
      collectionDate: collectionDate
    })
  })

export const assignDeliveryDate = (
  shipmentId: string,
  deliveryDate: Date
): Promise<void> =>
  fetchFromApi('/partner/shipments/assignestimateddeliverydate', undefined, {
    method: 'POST',
    body: JSON.stringify({
      shipmentId: shipmentId,
      estimatedDeliveryDate: deliveryDate
    })
  })

export const markShipmentAsCollected = (shipmentId: string): Promise<void> =>
  fetchFromApi('/partner/shipments/recordcollection', undefined, {
    method: 'POST',
    body: JSON.stringify({ shipmentId: shipmentId, collected: true })
  })

export const addTrackingInfo = (trackingInfo: TrackingInfo): Promise<void> => {
  return fetchFromApi(`/partner/shipments/addtransitinformation`, undefined, {
    method: 'POST',
    body: JSON.stringify(trackingInfo)
  })
}

export const listAirlines = async (): Promise<AirlineList[]> =>
  fetchFromApi('/airlines', undefined, {
    method: 'GET'
  })

export const listAirlinesTrackable = async (): Promise<AirlineList[]> =>
  fetchFromApi('/airlines/trackable', undefined, {
    method: 'GET'
  })

export const validateContainerId = (
  containerId: string
): Promise<ValidateContainerResponse> => {
  return fetchFromApi(
    `/reference/validatecontainerid`,
    { containerId },
    {
      method: 'GET'
    }
  )
}

export const getTransitInformation = (
  shipmentId: string
): Promise<TransitInformation> =>
  fetchFromApi(
    `/partner/shipments/transitinformation`,
    { shipmentId },
    {
      method: 'GET'
    }
  )

export const markArrivedPOD = (shipmentId: string): Promise<void> =>
  fetchFromApi(`/partner/shipments/recordarrivedpod`, undefined, {
    method: 'POST',
    body: JSON.stringify({
      shipmentId,
      arrivalDatePOD: new Date(Date.now()),
      arrived: true
    })
  })

export const markClearedCustoms = (shipmentId: string): Promise<void> =>
  fetchFromApi(`/partner/shipments/recordclearedcustoms`, undefined, {
    method: 'POST',
    body: JSON.stringify({
      shipmentId,
      clearedCustomsDate: new Date(Date.now()),
      clearedCustoms: true
    })
  })

export const markDepartedPOL = (shipmentId: string): Promise<void> =>
  fetchFromApi(`/partner/shipments/recorddepartedpol`, undefined, {
    method: 'POST',
    body: JSON.stringify({
      shipmentId,
      departureDatePOL: new Date(Date.now()),
      collected: true
    })
  })

export const markIssueAtCustoms = (shipmentId: string): Promise<void> =>
  fetchFromApi(`/partner/shipments/recordissueatcustoms`, undefined, {
    method: 'POST',
    body: JSON.stringify({
      shipmentId,
      issueAtCustomsDate: new Date(Date.now()),
      issueAtCustoms: true
    })
  })

export const markDelivered = (shipmentId: string): Promise<void> =>
  fetchFromApi(`/partner/shipments/markdelivered`, undefined, {
    method: 'POST',
    body: JSON.stringify({
      shipmentId,
      deliveryDate: new Date(Date.now()),
      delivered: false
    })
  })

export const getVesselTracking = (
  shipmentId: string
): Promise<AISTrackingResult> =>
  fetchFromApi(`/shipment/${shipmentId}/vesseltrack`, undefined, {
    method: 'GET'
  })

export const assignAwbNumber = (
  shipmentId: string,
  awbSerialNo: string,
  awbPrefix: string
): Promise<void> =>
  fetchFromApi(`/partner/shipments/assignawbnumber`, undefined, {
    method: 'POST',
    body: JSON.stringify({
      awbPrefix,
      awbSerialNo,
      shipmentId
    })
  })

export const assignBolNumber = (
  shipmentId: string,
  bolNumber: string
): Promise<void> =>
  fetchFromApi(`/partner/shipments/assignbolnumber`, undefined, {
    method: 'POST',
    body: JSON.stringify({
      shipmentId,
      bolNumber
    })
  })

export const amendPartnerShipment = (
  isManualRoute: boolean,
  isReschedule: boolean,
  shipmentId: string,
  charge: number,
  goodsReady: string,
  departureDate: string,
  arrivalDate: string,
  routes: RouteSchedule[],
  numberOfChanges: number
): Promise<void> =>
  fetchFromApi('/partner/shipments/amendschedule', undefined, {
    method: 'POST',
    body: JSON.stringify({
      isManualRoute,
      isReschedule,
      shipmentId,
      charge,
      goodsReady,
      departurelDate: departureDate,
      arrivalDate,
      route: routes[0],
      numberOfChanges
    })
  })

export const getShipmentTracking = (id: string): Promise<TrackingResource[]> =>
  fetchFromApi(`/shipment/${id}/track`, undefined, { method: 'GET' })

export const getShipperCargoItem = (
  id: string,
  userType: string,
  pageNumber?: number,
  pageSize?: number,
  search?: string
): Promise<Page<CargoItem[]>> =>
  fetchFromApi(`/${userType}/shipmentcargo/`, {
    id,
    pageNumber,
    pageSize,
    search
  })
