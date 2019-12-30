import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

import reducers from '../reducer'

const isDev = window.require('electron-is-dev')


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default createStore(
  reducers,
  composeEnhancers(applyMiddleware(...[thunk, isDev ? logger : null]))
  // composeEnhancers(applyMiddleware(...[thunk]))
)
