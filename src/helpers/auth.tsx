import { Configuration, PopupRequest } from '@azure/msal-browser'
import { msalInstance } from '../components/router/router'

export const handleLogout = () => {
  msalInstance.logoutRedirect()
}

// export const msalConfig: Configuration = {
//   auth: {
//     authority: process.env.APP_AUTHORITY,
//     knownAuthorities: ['tradefactidentity.b2clogin.com'],
//     clientId: process.env.AAD_APP_CLIENT_ID,
//     redirectUri: process.env.APP_URL
//   }
// }

// export const loginRequest: PopupRequest = {
//   scopes: ['https://tradefactidentity.onmicrosoft.com/api/dev.read']
// }

// export const accessTokenRequest = {
//   scopes: ['https://tradefactidentity.onmicrosoft.com/api/dev.read']
// }

export const msalConfig: Configuration = {
  auth: {
    authority: process.env.APP_AUTHORITY,
    knownAuthorities: ['getflare.b2clogin.com'],
    clientId: process.env.AAD_APP_CLIENT_ID,
    redirectUri: process.env.APP_URL
  }
  // },
  // cache: {
  //   cacheLocation: "sessionStorage", // This configures where your cache will be stored
  //   storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  // }
}

export const loginRequest: PopupRequest = {
  scopes: ['https://getflare.onmicrosoft.com/api/flare.read']
}

export const accessTokenRequest = {
  scopes: ['https://getflare.onmicrosoft.com/api/flare.read']
}
