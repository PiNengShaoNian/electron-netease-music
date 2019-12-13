import React, { memo, useMemo } from 'react'
import { useSelector } from 'react-redux'

import User from '../components/User'
import {menuRoutes} from '../router'

const menus = [
  {
    type: 'root',
    children: menuRoutes
  }
]

export default memo(function LayoutMenu() {
  const isLogin = useSelector(({ user }) => !!user.userId)
  const menusWithPlaylist = useMemo(() => {
    return isLogin && this.userMenus.length ? menus.concat(userMenus) : menus
  }, [isLogin])
  return (
    <div className="menu">
      <User />
      <div className="menu-wrap">
        {}
        <div className="menu-block"></div>
      </div>
    </div>
  )
})
