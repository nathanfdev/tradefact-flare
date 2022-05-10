export const ORGANIZATION_HELP_LINK = 'https://tradefact.stonly.com/kb'
export const PARTNER_HELP_LINK = 'https://logistics-partners-k.stonly.com/kb/'

export const DEFAULT_WIDGET_WIDTH = 1
export const DASHBOARD = {
  SHIPMENTS_KEY: 'shipmentsWidget',
  PURCHASE_ORDERS_KEY: 'purchaseOrdersWidget',
  QUOTES_KEY: 'quotesWidget',
  MAP_KEY: 'mapWidget',
  EXCEPTIONS_KEY: 'exceptionsWidget',
  NEWS_KEY: 'newsWidget',
  NETWORK_KEY: 'networkWidget',
  ACTIVITY_KEY: 'activityWidget'
}

export enum REDUX_LOADING_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed'
}

export type ReduxLoadingState =
  | REDUX_LOADING_STATUS.IDLE
  | REDUX_LOADING_STATUS.LOADING
  | REDUX_LOADING_STATUS.SUCCEEDED
  | REDUX_LOADING_STATUS.FAILED

export enum REDUX_ACTION_STATE {
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected'
}

export const SEARCH_DEBOUNCE_TIMEOUT = 1000

export const ALL_COUNTRY_FILTER = 'All'
