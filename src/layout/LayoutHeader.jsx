import React, { memo, useCallback } from 'react'
import { useSelector } from 'react-redux'

import Icon from '../base/Icon'
import RoutesHistory from '../components/RoutesHistory'
import Search from '../components/Search'
import Theme from '../components/Theme'

import './LayoutHeader.scss'

export default memo(function LayoutHeader() {
  const isPlayerShow = useSelector(({ music }) => music.isPlayerShow)
  const onClickLogo = useCallback(() => {}, [])

  const exitFullScreen = useCallback(() => {}, [])

  const fullScreen = useCallback(() => {}, [])

  const onClickDown = useCallback(() => {}, [])
  return (
    <div className="layout-header">
      <div className="left">
        <div className="buttons">
          <div onClick={onClickLogo} className="mac-button red">
            <Icon size={9} type="home" />
          </div>
          <div onClick={exitFullScreen} className="mac-button yellow">
            <Icon size={9} type="minus" />
          </div>
          <div className="mac-button green" onClick={fullScreen}>
            <Icon size={9} type="fullscreen" />
          </div>
        </div>
        {isPlayerShow && (
          <div onClick={onClickDown} className="shrink-player">
            <Icon backdrop={true} type="down" />
          </div>
        )}

        {!isPlayerShow && (
          <div className="history">
            <RoutesHistory />
          </div>
        )}
      </div>
      <div className="right">
        <div className="search-wrap">
          <Search />
        </div>
        <Theme />
      </div>
    </div>
  )
})
