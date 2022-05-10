import { HubspotProvider } from '@aaronhayes/react-use-hubspot-form'
import moment from 'moment'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Header, ProtectedRoutes } from '../.'
import { getUser } from '../../packages/tradefact-api'
import { UserInfoProvider } from '../user-info-provider'
import { useAppDispatch, useAppSelector } from './hooks'

export interface AppProps {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
}

export const App = ({ menuOpen, setMenuOpen }: AppProps) => {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { userInfo } = useAppSelector(state => state.user)
  useEffect(() => {
    if (!userInfo) {
      dispatch(getUser())
    }
  }, [userInfo])

  if (window.navigator.language == 'en-US') moment.locale('en')
  else moment.locale('en-GB')

  return (
    <UserInfoProvider>
      <HubspotProvider>
        <Header menuOpen={menuOpen} onMenuOpenChange={setMenuOpen} />
        <div
          className={
            location.pathname === '/create-stock-level-order'
              ? 'main-content-stock-level-order'
              : 'main-content'
          }
        >
          <div className={`main__content__inner`}>
            <ProtectedRoutes />
          </div>
        </div>
        <ToastContainer
          hideProgressBar
          autoClose={2000}
          closeButton={false}
          closeOnClick={true}
        />
      </HubspotProvider>
    </UserInfoProvider>
  )
}

export default App
