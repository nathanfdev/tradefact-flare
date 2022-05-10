import { fetchFromApi } from '.'
import { Document, Page, RichText } from '../tradefact-objects'
import { ProductDocumentType } from '../tradefact-objects/products'
import {
  AttachPurchaseOrderDocument,
  OrderDocument
} from '../tradefact-objects/purchase-order'
import { attachedOnly } from './purchase-orders'

export const listProductDocuments = (
  id: string,
  search?: string,
  documentType?: ProductDocumentType,
  isRichText?: boolean
): Promise<Page<Document>> =>
  fetchFromApi('/document/product', {
    id,
    search,
    documentType,
    isRichText
  })

export const listProductRichTexts = (
  id: string,
  search?: string
): Promise<Page<RichText>> =>
  fetchFromApi('/document/productrichtext', {
    id,
    search
  })

export const listShipmentDocuments = (
  id: string,
  search?: string
): Promise<Page<Document>> =>
  fetchFromApi('/document/shipment', {
    id,
    search
  })

export const uploadOrderDocument = (
  id: string,
  file: File
): Promise<Document> => {
  const body = new FormData()
  body.append('', file, file.name)

  return fetchFromApi(
    '/document/purchaseorder',
    {
      id
    },
    {
      method: 'POST',
      body
    }
  )
}

export const listPurchaseOrderDocuments = (
  id: string,
  search?: string
): Promise<Page<OrderDocument>> =>
  fetchFromApi('/document/purchaseorder', {
    id,
    search
  })

export const listPurchaseOrderPaymentTermsDocuments = (
  id: string,
  search?: string
): Promise<Page<Document>> =>
  fetchFromApi('/document/purchaseorder/paymentterms', {
    id,
    search
  })

export const listAllAttachedProductDocuments = (
  id: string,
  search?: string,
  pageSize?: number
): Promise<Document[]> =>
  fetchFromApi('/document/product/attached', {
    id,
    search,
    pageSize
  })

export const uploadProductDocument = (
  id: string,
  description: string,
  file: File,
  documentType?: ProductDocumentType
): Promise<Document> => {
  const body = new FormData()
  body.append('', file, file.name)

  return fetchFromApi(
    '/document/product',
    {
      id,
      description,
      documentType
    },
    {
      method: 'POST',
      body
    }
  )
}

export const uploadShipmentDocument = (
  id: string,
  file: File
): Promise<Document> => {
  const body = new FormData()
  body.append('', file, file.name)

  return fetchFromApi(
    '/document/shipment',
    {
      id
    },
    {
      method: 'POST',
      body
    }
  )
}

export const uploadPurchaseOrderDocument = (
  id: string,
  file: File
): Promise<Document> => {
  const body = new FormData()
  body.append('', file, file.name)

  return fetchFromApi(
    '/document/purchaseorder',
    {
      id
    },
    {
      method: 'POST',
      body
    }
  )
}

export const uploadPurchaseOrderPaymentTermsDocument = (
  id: string,
  file: File
): Promise<Document> => {
  const body = new FormData()
  body.append('', file, file.name)

  return fetchFromApi(
    '/document/purchaseorder/paymentterms',
    {
      id
    },
    {
      method: 'POST',
      body
    }
  )
}

export const uploadProductDocumentDuplicates = (
  productId: string,
  documentIds: string[]
): Promise<void> => {
  return fetchFromApi('/document/productduplicate', undefined, {
    method: 'POST',
    body: JSON.stringify({ documentIds, productId })
  })
}

export const uploadRichTextProductDocument = (
  id: string,
  description: string,
  richTextData: string,
  documentType?: ProductDocumentType
): Promise<void> => {
  return fetchFromApi(
    '/document/productrichtext',
    {
      id,
      description,
      richTextData,
      documentType
    },
    {
      method: 'POST'
    }
  )
}

export const deleteDocument = (id: string): Promise<void> =>
  fetchFromApi(
    '/document',
    {
      id
    },
    {
      method: 'DELETE'
    }
  )

export const deleteProductDocument = (
  documentId: string,
  productId: string
): Promise<void> =>
  fetchFromApi(
    '/document/deleteproductdocument',
    {
      documentId,
      productId
    },
    {
      method: 'DELETE'
    }
  )

export const deletePurchaseOrderDocument = (id: string): Promise<void> =>
  fetchFromApi(
    '/document/purchaseorderdocument',
    {
      id
    },
    {
      method: 'DELETE'
    }
  )

export const downloadDocument = (id: string): Promise<string> =>
  fetchFromApi(
    '/document',
    {
      id
    },
    {
      method: 'POST'
    },
    true
  )

export const getPurchaseOrderDocuments = (
  id: string,
  productId: string,
  attachedonly?: attachedOnly
): Promise<AttachPurchaseOrderDocument[]> =>
  fetchFromApi(
    `/purchaseorder/${id}/product/${productId}/documents`,
    attachedonly,
    {
      method: 'GET'
    }
  )

export const getAllPurchaseOrderDocuments = (
  id: string
): Promise<AttachPurchaseOrderDocument[]> =>
  fetchFromApi(`/purchaseorder/${id}/product/documents`, undefined, {
    method: 'GET'
  })

export const getSingleRichText = (id: string): Promise<RichText> =>
  fetchFromApi(
    `/document/singleproductrichtext`,
    {
      id
    },
    {
      method: 'GET'
    }
  )

export const deletePurchaseOrderProductDocument = async (
  id: string,
  productId: string,
  documentId: string
): Promise<void> =>
  fetchFromApi(
    `/purchaseorder/${id}/product/${productId}/document/${documentId}`,
    undefined,
    {
      method: 'DELETE'
    }
  )

export const attachPurchaseOrderDocument = (
  id: string,
  productId: string,
  documentId: string,
  body: AttachPurchaseOrderDocument
): Promise<AttachPurchaseOrderDocument> =>
  fetchFromApi(
    `/purchaseorder/${id}/product/${productId}/document/${documentId}`,
    undefined,
    {
      method: 'POST',
      body: JSON.stringify(body)
    }
  )
