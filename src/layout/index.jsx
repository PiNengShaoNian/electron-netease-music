import React, { memo } from 'react'
import { useSelector } from 'react-redux'

import LayoutHeader from './LayoutHeader'
import LayoutMenu from './LayoutMenu'

export default memo(function Layout() {
  const isMenuShow = useSelector(({ music }) => music.isMenuShow)
  return (
    <div className="layout">
      <LayoutHeader />
      <div className="layout-body">
        {isMenuShow ? (
          <div className="layout-menu">
            <LayoutMenu />
          </div>
        ) : null}
      </div>
    </div>
  )
})
