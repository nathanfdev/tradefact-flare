import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import 'regenerator-runtime/runtime'
import { Router } from './components'
import { store } from './components/app'
import './i18n'
import './styles.scss'

ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.querySelector('#app')
)
