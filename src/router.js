import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import Discovery from './page/Discovery'
import Playlists from './page/Playlists'
import Songs from './page/Songs'
import Mvs from './page/Mvs'
import PlaylistDetail from './page/PlaylistDetail'
import Search from './page/Search'
import SearchSongs from './page/Search/Songs'
import SearchPlaylists from './page/Search/Playlists'
import SearchMvs from './page/Search/Mvs'
import Mv from './page/Mv'

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
  },
  {
    path: '/songs',
    name: 'songs',
    component: Songs,
    meta: {
      title: '最新音乐',
      icon: 'yinyue'
    }
  },
  {
    path: '/mvs',
    name: 'mvs',
    component: Mvs,
    meta: {
      title: '最新MV',
      icon: 'mv'
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
  {
    path: '/playlist/:id',
    component: PlaylistDetail
  },
  {
    path: '/search/:keywords',
    component: Search,
    routes: [
      {
        path: '/search',
        exact: true,
        render() {
          return <Redirect to="/search/:keywords/songs" />
        }
      },
      {
        path: '/search/:keywords/songs',
        component: SearchSongs
      },
      {
        path: '/search/:keywords/playlists',
        component: SearchPlaylists
      },
      {
        path: '/search/:keywords/mvs',
        component: SearchMvs
      }
    ]
  },
  {
    path: '/mv/:id',
    component: Mv
  },
  ...menuRoutes
]
