import moment from 'moment'
import { MinimalShipment } from '../packages/tradefact-objects'

export const getFormattedShipmentDate = (shipment: MinimalShipment) => {
  if (
    shipment.timeline.collection.state.name === 'Active' &&
    shipment.goodsReady &&
    moment(shipment?.goodsReady).isAfter('0001-01-01')
  ) {
    //Cargo / Goods Ready Date
    return {
      dateTitle: 'CRD',
      dateValue: moment(shipment.goodsReady).format('DD-MM-YYYY')
    }
  }

  if (
    shipment.timeline.collection.state.name === 'Active' &&
    shipment.collectionDate &&
    moment(shipment?.collectionDate).isAfter('0001-01-01')
  ) {
    // Estimated collection date
    return {
      dateTitle: 'ECD',
      dateValue: moment(shipment.collectionDate).format('DD-MM-YYYY')
    }
  }

  if (
    shipment.timeline.delivery.state.name === 'Active' &&
    shipment.availableActions.setEstimatedDeliveryDate &&
    shipment.estimatedDeliveryDate &&
    moment(shipment?.estimatedDeliveryDate).isAfter('0001-01-01')
  ) {
    // Estimated Delivery Date
    return {
      dateTitle: 'EDD',
      dateValue: moment(shipment.estimatedDeliveryDate).format('DD-MM-YYYY')
    }
  }

  if (
    shipment.timeline.inTransit.state.name === 'Active' &&
    shipment.timeline.inTransit.inTransitToPOL &&
    moment(shipment?.estimatedDeparturePOL).isAfter('0001-01-01')
  ) {
    // Estimated Departure from POL
    return {
      dateTitle: 'ETD',
      dateValue: moment(shipment.estimatedDeparturePOL).format('DD-MM-YYYY')
    }
  }

  if (
    shipment.timeline.inTransit.state.name === 'Active' &&
    shipment.timeline.inTransit.shipping &&
    moment(shipment?.estimatedArrivalPOD).isAfter('0001-01-01')
  ) {
    // Estimated Arrival at Port
    return {
      dateTitle: 'ETA',
      dateValue: moment(shipment.estimatedArrivalPOD).format('DD-MM-YYYY')
    }
  }

  if (
    shipment.timeline.delivery.state.name === 'Complete' &&
    moment(shipment?.timeline?.delivery?.dateTime).isAfter('0001-01-01')
  ) {
    //Estimated Time of Completion
    return {
      dateTitle: 'ETC',
      dateValue: `${moment(shipment.timeline.delivery.dateTime).format(
        'DD-MM-YYYY'
      )}`
    }
  }

  return {
    dateTitle: 'No Dates',
    dateValue: null
  }
}
