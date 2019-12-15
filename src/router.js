import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import Discovery from './page/Discovery'
import Playlists from './page/Playlists'

export const renderRoutes = (routes, extraProps) => {
  return routes ? (
    <Switch>
      {routes.map((route, i) => (
        <Route
          key={route.key || route.path || i}
          path={route.path}
          exact={route.exact}
          render={props =>
            route.render ? (
              route.render({ ...props, ...extraProps, route })
            ) : (
              <route.component {...props} {...extraProps} route={route} />
            )
          }
        />
      ))}
    </Switch>
  ) : null
}

export const menuRoutes = [
  {
    path: '/discovery',
    component: Discovery,
    meta: {
      title: '发现音乐',
      icon: 'music'
    }
  },
  {
    path: '/playlists',
    component: Playlists,
    meta: {
      title: '推荐歌单',
      icon: 'playlist-menu'
    }
  }
]

export default [
  {
    path: '/',
    exact: true,
    render() {
      return <Redirect to="/discovery" />
    }
  },
  ...menuRoutes
]
