import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import store from './store'
import Layout from './layout'
import MiniPlayer from './components/MiniPlayer'
import Player from './components/Player'

import 'element-theme-default'

function App() {
  return (
    <>
      <Provider store={store}>
        <Router>
          <Layout />
          <MiniPlayer />
          <Player />
        </Router>
      </Provider>
    </>
  )
}

export default App
