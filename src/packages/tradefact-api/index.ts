import {
  AuthenticationResult,
  InteractionRequiredAuthError
} from '@azure/msal-browser'
import moment from 'moment'
import { msalInstance } from '../../components/router/router'
import { accessTokenRequest, handleLogout } from '../../helpers/auth'
import { getActivityList } from './activity'
import {
  addNewAddressToCompany,
  deleteAddress,
  getAddress,
  listCompanyAddressesNoId,
  listAddressesNoIdNoPaging,
  listDirectoryAddresses,
  listCompanyAddressesNoPaging,
  updateAddress
} from './address'
import { listBillings } from './billing'
import { listCarriers } from './carrier'
import {
  createCompany,
  listCompanies,
  listCompaniesNoPaging,
  listCompanyShipments,
  listOfCompanysAndLogistics
} from './company'
import {
  addNewContactToDirectory,
  deleteContact,
  getContacts,
  updateContact,
  downloadCsvReport
} from './contact'
import { listCountries } from './country'
import {
  attachPurchaseOrderDocument,
  deleteDocument,
  deleteProductDocument,
  deletePurchaseOrderDocument,
  deletePurchaseOrderProductDocument,
  downloadDocument,
  getAllPurchaseOrderDocuments,
  getPurchaseOrderDocuments,
  getSingleRichText,
  listAllAttachedProductDocuments,
  listProductDocuments,
  listProductRichTexts,
  listPurchaseOrderDocuments,
  listPurchaseOrderPaymentTermsDocuments,
  listShipmentDocuments,
  uploadOrderDocument,
  uploadProductDocument,
  uploadProductDocumentDuplicates,
  uploadPurchaseOrderDocument,
  uploadPurchaseOrderPaymentTermsDocument,
  uploadRichTextProductDocument,
  uploadShipmentDocument
} from './document'
import {
  getFreightMovement,
  listContainerTypes,
  postFreightMovement
} from './freight-movement'
import { listHazardClasses } from './hazard-class'
import { getNewsUpdates } from './news'
import { getNotes, updateNotes } from './notes'
import {
  acceptPartnershipInvite,
  checkOrganisationAvailability,
  fetchCompanyNameFromInvitation,
  inviteOrganisation,
  sendPartnershipInvite
} from './organisation'
import {
  createPartnerInvoiceAddress,
  createCompanyInvoiceAddress,
  getForwarderCustomers,
  getCompany,
  getPartnerInvoiceAddress,
  getCompanyInvoiceAddress,
  listQuotes,
  updateCompany,
  updatePartner,
  updatePartnerInvoiceAddress,
  updateCompanyInvoiceAddress
} from './partner'
import { listPorts } from './ports'
import {
  addThumbnailImage,
  createProduct,
  deleteProduct,
  getProductById,
  importProductsFromFile,
  listProducts,
  listSupplierProducts,
  updateProduct
} from './products'
import {
  acceptPurchaseOrder,
  completePurchaseOrder,
  copyProductsFromOrder,
  createPurchaseOrder,
  createSchedule,
  createStockLevelOrder,
  deleteAllPurchaseOrderItems,
  deletePurchaseOrder,
  deletePurchaseOrderCharge,
  deletePurchaseOrderItem,
  deleteSchedule,
  downloadOrderItems,
  getAllSchedules,
  getImportUpdate,
  getPurchaseOrderActivity,
  getPurchaseOrderById,
  getPurchaseOrderCharge,
  getPurchaseOrderItems,
  getPurchaseOrderQuotes,
  getPurchaseOrders,
  getPurchaseOrderSchedules,
  getPurchaseOrderShipments,
  getScheduleDetails,
  importFromFile,
  inProductionPurchaseOrder,
  noProductSearch,
  patchPurchaseOrder,
  postShippingQuote,
  preShipmentPurchaseOrder,
  rejectPurchaseOrder,
  removePurchaseOrderDocument,
  requestUpdate,
  resendPurchaseOrderMail,
  resetOrderStatus,
  resetToDraftOrder,
  shippedPurchaseOrder,
  submitPurchaseOrder,
  submitPurchaseOrderCharge,
  submitPurchaseOrderItem,
  submitPurchaseOrderItemList,
  updatePurchaseOrder,
  updatePurchaseOrderCharge,
  updatePurchaseOrderItem
} from './purchase-orders'
import { submitQuotation } from './quotation'
import {
  getQuotationRequest,
  getQuotationRequestCargoItems,
  getQuotationRequestItemsById
} from './quotation-request'
import {
  addRoomMessage,
  deleteRoomMessage,
  listRoomMessages,
  updateRoomMessage
} from './room'
import { listRouteSchedules } from './route-schedules'
import {
  addTrackingInfo,
  amendPartnerShipment,
  assignAwbNumber,
  assignBolNumber,
  assignCollectionDate,
  assignDeliveryDate,
  getPartnerShipment,
  getShipmentTracking,
  getShipperCargoItem,
  getShipperShipment,
  getTransitInformation,
  getVesselTracking,
  listAirlines,
  listAirlinesTrackable,
  listForwarderShipments,
  listShipperShipments,
  markArrivedPOD,
  markClearedCustoms,
  markDelivered,
  markDepartedPOL,
  markIssueAtCustoms,
  markShipmentAsCollected,
  submitShipment,
  updateTags,
  validateContainerId
} from './shipment'
import {
  createShipperInvoiceAddress,
  downloadQuoteOrderItems,
  getShipper,
  getShipperInvoiceAddress,
  getShipperLogisticsClients,
  getShipperPartnership,
  listShipperQuotes,
  updateShipper,
  updateShipperInvoiceAddress
} from './shipper'
import { upload, uploadImage, uploadProfileImage } from './upload'
import {
  createUser,
  getProfile,
  // getSubscriptionStatus,
  inviteUser,
  listUsers,
  readUser,
  resendInvite,
  updateUser,
  updateUserPreferences
} from './user'

export type QueryObject = {
  [name: string]: string[] | string | number | boolean | undefined
}

const rethrow = (x: unknown): never => {
  if (x instanceof Error) {
    throw x
  }

  throw new Error(x as string)
}

const callApi = (
  accessToken: string,
  url: string,
  init?: RequestInit,
  blob?: boolean
) => {
  const headers: { [name: string]: string } = {}
  if (!(init?.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }
  const bearer = `Bearer ${accessToken}`

  headers['Authorization'] = bearer

  return fetch(url, {
    ...init,
    headers: {
      ...headers,
      ...init?.headers
    }
  })
    .then(async r => {
      if (init?.method === 'DELETE') {
        return null
      }
      try {
        if (!blob) {
          const json = await r.json()
          if (r.status === 200 || r.status === 201 || r.status === 409) {
            return json
          } else {
            throw new Error(json.errors[0].message)
          }
        } else {
          const blob = await r.blob()
          const blob2 = new Blob([blob], { type: blob.type })
          const downloadUrl = URL.createObjectURL(blob2)
          return downloadUrl
        }
      } catch (err) {
        if (r.status === 401) {
          handleLogout()
        } else if (r.status !== 200 && r.status !== 201) {
          throw err
        } else {
          return null
        }
      }
    })
    .catch(rethrow)
}

export const fetchFromApi = async <T>(
  path: string,
  qs?: QueryObject,
  init?: RequestInit,
  blob?: boolean
): Promise<T> => {
  const params = qs
    ? '?' +
      Object.keys(qs)
        .map(k => [k, qs[k]])
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${k}=${v}`)
        .join('&')
    : ''

  const url = `${process.env.API_URL}${path}${params}`
  const account = await msalInstance.getActiveAccount()
  if (!account) {
    throw Error(
      'No active account! Verify a user has been signed in and setActiveAccount has been called.'
    )
  }

  const redirectResponse = await msalInstance.handleRedirectPromise()
  const tokenNotExpired = moment(
    redirectResponse?.expiresOn || moment()
  ).isAfter(moment())

  if (redirectResponse !== null && tokenNotExpired) {
    let accessToken = redirectResponse.accessToken
    return callApi(accessToken, url, init, blob)
  }

  const response = await msalInstance
    .acquireTokenSilent({ ...accessTokenRequest, account })
    .then((accessTokenResponse: AuthenticationResult) => {
      let accessToken = accessTokenResponse.accessToken
      return callApi(accessToken, url, init, blob)
    })
    .catch(error => {
      //Acquire token silent failure, and send an interactive request
      if (error instanceof InteractionRequiredAuthError) {
        msalInstance.acquireTokenRedirect(accessTokenRequest)
      }
      console.log(error)
    })

  return response
}

export * from './activity'
export * from './address'
export * from './billing'
export * from './company'
export * from './contact'
export * from './country'
export * from './document'
export * from './freight-movement'
export * from './organisation'
export * from './ports'
export * from './products'
export * from './quotation-request'
export * from './room'
export * from './shipment'
export * from './shipper'
export * from './user'

export default {
  listDirectoryAddresses,
  listProducts,
  listQuotes,
  listCompanies,
  listOfCompanysAndLogistics,
  listBillings,
  listUsers,
  listShipmentDocuments,
  listPurchaseOrderDocuments,
  listPurchaseOrderPaymentTermsDocuments,
  getFreightMovement,
  listContainerTypes,
  listPorts,
  createProduct,
  deleteProduct,
  updateProduct,
  checkOrganisationAvailability,
  postFreightMovement,
  getCompany,
  createCompany,
  listCountries,
  getContacts,
  addNewContactToDirectory,
  updateContact,
  downloadCsvReport,
  updateAddress,
  deleteContact,
  getAddress,
  addNewAddressToCompany,
  deleteAddress,
  getNotes,
  updateNotes,
  listCompanyAddressesNoId,
  listCompaniesNoPaging,
  listAddressesNoIdNoPaging,
  listCompanyAddressesNoPaging,
  getProfile,
  getShipper,
  updateShipper,
  updateCompany,
  updatePartner,
  updateShipperInvoiceAddress,
  createShipperInvoiceAddress,
  getShipperInvoiceAddress,
  updatePartnerInvoiceAddress,
  updateCompanyInvoiceAddress,
  createPartnerInvoiceAddress,
  createCompanyInvoiceAddress,
  getPartnerInvoiceAddress,
  getCompanyInvoiceAddress,
  upload,
  uploadImage,
  listHazardClasses,
  getQuotationRequest,
  listShipperQuotes,
  uploadProfileImage,
  createUser,
  updateUser,
  updateUserPreferences,
  listRouteSchedules,
  submitQuotation,
  listForwarderShipments,
  submitShipment,
  assignCollectionDate,
  markShipmentAsCollected,
  listShipperShipments,
  getShipperShipment,
  listCarriers,
  addTrackingInfo,
  listAirlines,
  listAirlinesTrackable,
  validateContainerId,
  getTransitInformation,
  markArrivedPOD,
  markClearedCustoms,
  markDepartedPOL,
  markIssueAtCustoms,
  markDelivered,
  assignDeliveryDate,
  getShipperPartnership,
  getShipperLogisticsClients,
  getPartnerShipment,
  listSupplierProducts,
  uploadShipmentDocument,
  uploadPurchaseOrderDocument,
  uploadPurchaseOrderPaymentTermsDocument,
  uploadRichTextProductDocument,
  listRoomMessages,
  deleteRoomMessage,
  readUser,
  addRoomMessage,
  updateRoomMessage,
  addThumbnailImage,
  updateTags,
  getVesselTracking,
  deleteDocument,
  deleteProductDocument,
  deletePurchaseOrderDocument,
  downloadDocument,
  assignBolNumber,
  assignAwbNumber,
  getForwarderCustomers,
  inviteOrganisation,
  amendPartnerShipment,
  sendPartnershipInvite,
  acceptPartnershipInvite,
  fetchCompanyNameFromInvitation,
  listCompanyShipments,
  uploadProductDocument,
  uploadProductDocumentDuplicates,
  listProductDocuments,
  listProductRichTexts,
  getProductById,
  inviteUser,
  resendInvite,
  createPurchaseOrder,
  getPurchaseOrderById,
  getPurchaseOrders,
  patchPurchaseOrder,
  updatePurchaseOrder,
  submitPurchaseOrderItem,
  getPurchaseOrderItems,
  deletePurchaseOrderItem,
  updatePurchaseOrderItem,
  removePurchaseOrderDocument,
  submitPurchaseOrderCharge,
  getPurchaseOrderCharge,
  deletePurchaseOrderCharge,
  updatePurchaseOrderCharge,
  submitPurchaseOrder,
  acceptPurchaseOrder,
  inProductionPurchaseOrder,
  rejectPurchaseOrder,
  completePurchaseOrder,
  preShipmentPurchaseOrder,
  attachPurchaseOrderDocument,
  getPurchaseOrderDocuments,
  deletePurchaseOrderProductDocument,
  getAllPurchaseOrderDocuments,
  getSingleRichText,
  postShippingQuote,
  shippedPurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrderActivity,
  importFromFile,
  getImportUpdate,
  deleteAllPurchaseOrderItems,
  downloadOrderItems,
  downloadQuoteOrderItems,
  resetToDraftOrder,
  copyProductsFromOrder,
  listAllAttachedProductDocuments,
  noProductSearch,
  getShipmentTracking,
  createStockLevelOrder,
  importProductsFromFile,
  createSchedule,
  getPurchaseOrderSchedules,
  getPurchaseOrderShipments,
  getPurchaseOrderQuotes,
  getAllSchedules,
  getScheduleDetails,
  deleteSchedule,
  requestUpdate,
  submitPurchaseOrderItemList,
  uploadOrderDocument,
  resetOrderStatus,
  resendPurchaseOrderMail,
  getNewsUpdates,
  getShipperCargoItem,
  // getSubscriptionStatus,
  getQuotationRequestCargoItems,
  getQuotationRequestItemsById,
  getActivityList
}
