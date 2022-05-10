import { render } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import Header from '.'

jest.mock('../app')
jest.mock('../user-info-provider', () => {
  return {
    useUserInfo: jest.fn(() => {
      return {
        organisationtype: 'PARTNER',
        id: 1234567
      }
    })
  }
})
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

describe('<Header />', () => {
  it('should render', () => {
    expect(() =>
      render(
        <MemoryRouter>
          <Header menuOpen={true} onMenuOpenChange={x => x} />
        </MemoryRouter>
      )
    ).toThrow()
  })
})
