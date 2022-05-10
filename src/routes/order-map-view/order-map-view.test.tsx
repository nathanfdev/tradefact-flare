import { render } from '@testing-library/react'
import React from 'react'
import OrderMapView from './order-map-view'

jest.mock('../../helpers/auth', () => {
  return {
    msalConfig: {
      auth: {
        authority: process.env.APP_AUTHORITY,
        knownAuthorities: ['tradefactidentity.b2clogin.com'],
        clientId: process.env.AAD_APP_CLIENT_ID,
        redirectUri: process.env.APP_URL
      }
    }
  }
})

describe('<OrderMapView />', () => {
  it('should render', () => {
    expect(() => render(<OrderMapView />)).not.toThrow()
  })
})
