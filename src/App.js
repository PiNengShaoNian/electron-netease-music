import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import store from './store'
import Layout from './layout'

import 'element-theme-default'

function App() {
  return (
    <>
      <Provider store={store}>
        <Router>
          <Layout />
        </Router>
      </Provider>
    </>
  )
}

export default App
