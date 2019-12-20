import React, { memo, useMemo } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import User from '../components/User'
import Icon from '../base/Icon'
import CustomLink from '../components/CustomLink'
import { menuRoutes } from '../router'
import * as getters from '../store/getters'

import './LayoutMenu.scss'

const menus = [
  {
    type: 'root',
    children: menuRoutes
  }
]

export default memo(function LayoutMenu() {
  const isLogin = useSelector(getters.isLogin, shallowEqual)
  const userMenus = useSelector(getters.userMenus, shallowEqual)
  const menusWithPlaylist = useMemo(() => {
    return isLogin && userMenus.length ? menus.concat(userMenus) : menus
  }, [isLogin, userMenus])
  return (
    <div className="menu">
      <User />
      <div className="menu-wrap">
        {menusWithPlaylist.map((menu, index) => (
          <div className="menu-block" key={index}>
            {menu.title ? <p className="menu-block-title" /> : null}
            <ul className="menu-list">
              {menu.children.map((item, index) => (
                <CustomLink
                  key={index}
                  to={item.path}
                  activeClass="menu-item-active"
                  className="menu-item"
                  tag="li"
                >
                  <Icon size={16} type={item.meta.icon} className="iconfont" />
                  <span className="menu-title">{item.meta.title}</span>
                </CustomLink>
              ))}
            </ul>
          </div>
        ))}
        <div className="menu-block"></div>
      </div>
    </div>
  )
})
