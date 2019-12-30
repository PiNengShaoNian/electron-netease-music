import React, { memo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Icon from '../base/Icon'
import RoutesHistory from '../components/RoutesHistory'
import Search from '../components/Search'
import Theme from '../components/Theme'
import { setPlayerShow } from '../action/music'

import './LayoutHeader.scss'

const { ipcRenderer } = window.require('electron')

export default memo(function LayoutHeader() {
  const isPlayerShow = useSelector(({ music }) => music.isPlayerShow)
  const dispatch = useDispatch()
  const history = useHistory()

  const onClickLogo = useCallback(() => {
    history.push('/')
  }, [history])

  const exitFullScreen = useCallback(() => {
    ipcRenderer.send('unmaximize')
  }, [])

  const fullScreen = useCallback(() => {
    ipcRenderer.send('maximize')
  }, [])

  const handleCloseClick = useCallback(() => {
    ipcRenderer.send('close')
  }, [])

  const onClickDown = useCallback(() => {
    dispatch(setPlayerShow(false))
  }, [dispatch])
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
      <div className="drag-section" />
      <div className="right">
        <div className="search-wrap">
          <Search />
        </div>
        <Theme />
      </div>

      <div className="close-btn" onClick={handleCloseClick}>
        <i className="el-icon-close"></i>
      </div>
    </div>
  )
})
