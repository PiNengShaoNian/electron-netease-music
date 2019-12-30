import React, {
  memo,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo
} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import classnames from 'classnames'
import { bindActionCreators } from 'redux'

import {
  setPlaylistShow,
  clearPlayHistory,
  clearPlaylist
} from '../../action/music'
import Toggle from '../../base/Toggle'
import SongTable from '../../components/SongTable'
import Icon from '../../base/Icon'
import Tabs from '../../base/Tabs'

import './index.scss'

const tabs = ['播放列表', '历史记录']
const LIST_TAB = 0
const hideColumns = ['index', 'img', 'albumName']

export default memo(function Playlist() {
  const [reserveDoms, setReserveDoms] = useState([])
  const isPlaylistShow = useSelector(({ music }) => music.isPlaylistShow)
  const playlist = useSelector(({ music }) => music.playlist)
  const playHistory = useSelector(({ music }) => music.playHistory)
  const dispatch = useDispatch()
  const playlistRef = useRef()
  const [activeTab, setActiveTab] = useState(LIST_TAB)

  const isPlaylist = useMemo(() => {
    return activeTab === LIST_TAB
  }, [activeTab])

  const bindedActions = useMemo(() => {
    return bindActionCreators(
      {
        setPlaylistShow,
        clearPlayHistory,
        clearPlaylist
      },
      dispatch
    )
  }, [dispatch])

  const dataSource = useMemo(() => {
    return isPlaylist ? playlist : playHistory
  }, [isPlaylist, playHistory, playlist])

  const handleToggleChange = useCallback(
    isShow => {
      bindedActions.setPlaylistShow(isShow)
    },
    [bindedActions]
  )

  const onTabChange = useCallback(tab => {
    setActiveTab(tab)
  }, [])

  const clear = useCallback(() => {
    if (isPlaylist) {
      bindedActions.clearPlaylist()
    } else {
      bindedActions.clearPlayHistory()
    }
  }, [bindedActions, isPlaylist])

  useEffect(() => {
    setReserveDoms([document.getElementById('mini-player')])
  }, [])

  return (
    <Toggle
      reserveDoms={reserveDoms}
      show={isPlaylistShow}
      onChange={handleToggleChange}
    >
      <div
        className={classnames('playlist', { hide: !isPlaylistShow })}
        ref={playlistRef}
      >
        <Tabs tabs={tabs} align="center" onActiveTabChange={onTabChange} />
        <div className="header">
          <p className="total">总共{dataSource.length}</p>
          {dataSource.length ? (
            <div className="remove" onClick={clear}>
              <Icon type="remove" />
              <span className="text">清空</span>
            </div>
          ) : null}
        </div>
        <>
          {dataSource.length ? (
            <div className="song-table-wrap">
              <SongTable hideColumns={hideColumns} songs={dataSource} />
            </div>
          ) : (
            <div className="empty">你还没有添加任何歌曲</div>
          )}
        </>
      </div>
    </Toggle>
  )
})
