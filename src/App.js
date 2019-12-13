import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import store from './store'
import Layout from './layout'

import 'element-theme-default'

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <Layout />
        </Router>
      </Provider>
    </div>
  )
}

export default App
