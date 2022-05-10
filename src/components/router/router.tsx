import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionType,
  PublicClientApplication
} from '@azure/msal-browser'
import { MsalAuthenticationTemplate, MsalProvider } from '@azure/msal-react'
import { get } from 'lodash'
import React, { Suspense, useState } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { App } from '../.'
import { loginRequest, msalConfig } from '../../helpers/auth'

export const msalInstance = new PublicClientApplication(msalConfig)
export function doPasswordReset() {
  const redirectURI = `https://tradefactidentity.b2clogin.com/tradefactidentity.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_pr&client_id=${process.env.AAD_APP_CLIENT_ID}&nonce=defaultNonce&redirect_uri=${process.env.REDIRECT_URL}&scope=openid&response_type=code&prompt=login`
  window.location.href = redirectURI
}

const accounts = msalInstance.getAllAccounts()
if (accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0])
}

msalInstance.addEventCallback((event: EventMessage) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const payload = event.payload as AuthenticationResult
    const account = payload.account
    msalInstance.setActiveAccount(account)
  }

  if (
    event.eventType === EventType.LOGIN_FAILURE &&
    get(event, 'error.errorMessage').includes('AADB2C90118')
  ) {
    doPasswordReset()
  }
})

const Router = () => {
  const [menuOpen, setMenuOpen] = useState(true)

  const authRequest = {
    ...loginRequest
  }

  return (
    <Suspense fallback='loading'>
      <HashRouter>
        <Switch>
          <Route path='/'>
            <MsalProvider instance={msalInstance}>
              <MsalAuthenticationTemplate
                interactionType={InteractionType.Redirect}
                authenticationRequest={authRequest}
              >
                <App menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
              </MsalAuthenticationTemplate>
            </MsalProvider>
          </Route>
        </Switch>
      </HashRouter>
    </Suspense>
  )
}

export default Router
