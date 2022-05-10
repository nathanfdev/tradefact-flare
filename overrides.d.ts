declare namespace NodeJS {
  export interface ProcessEnv {
    readonly ENVIRONMENT: string
    readonly API_URL: string
    readonly APP_AUTHORITY: string
    readonly AAD_APP_CLIENT_ID: string
    readonly HERE_KEY: string
    readonly LOGOUT_URL: string
    readonly REDIRECT_URL: string
  }
}

interface Window {
  H: any
  smartlook: any
}

declare module 'smartlook-client'
