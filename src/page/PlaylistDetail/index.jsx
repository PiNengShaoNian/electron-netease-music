import React, { memo, useState, useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Input } from 'element-react'

import DetailHeader from './DetailHeader'
import Tabs from '../../base/Tabs'
import SongTable from '../../components/SongTable'
import Comments from '../../components/Comments'
import { getSongDetail } from '../../api/song'
import { getListDetail } from '../../api/songlist'
import { createSong } from '../../utils/business'

import './index.scss'

const MAX = 500
const SONG_IDX = 0
const COMMENT_IDX = 1

export default memo(function PlaylistDetail() {
  const [tabs, setTabs] = useState(['歌曲列表', '评论'])
  const [playlist, setPlaylist] = useState({})
  const [songs, setSongs] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState(SONG_IDX)
  const [inputFocus, setInputFocus] = useState(false)

  const genSonglist = useCallback(async playlist => {
    const trackIds = playlist.trackIds.map(({ id }) => id)
    const songDetails = await getSongDetail(trackIds.slice(0, MAX))
    const songs = songDetails.songs.map(({ id, name, al, ar, mv, dt }) =>
      createSong({
        id,
        name,
        artists: ar,
        duration: dt,
        albumName: al.name,
        img: al.picUrl,
        mvId: mv
      })
    )
    setSongs(songs)
  }, [])

  const onCommentsUpdate = useCallback(({ total }) => {
    setTabs(['歌曲列表', `评论(${total})`])
  }, [])

  const init = useCallback(async () => {
    if (!id) return
    const { playlist } = await getListDetail({ id: id })
    setPlaylist(playlist)
    genSonglist(playlist)
  }, [id, genSonglist])

  const onTabChange = useCallback(index => {
    setActiveTab(index)
  }, [])

  const onBlur = useCallback(() => {
    setInputFocus(false)
  }, [])

  const onFocus = useCallback(() => {
    setInputFocus(true)
  }, [])

  const onInputChange = useCallback(value => {
    setSearchValue(value)
  }, [])

  const filteredSongs = useMemo(() => {
    return songs.filter(({ name, artistsText, albumName }) =>
      `${name}${artistsText}${albumName}`
        .toLowerCase()
        .includes(searchValue.toLowerCase())
    )
  }, [songs, searchValue])

  console.log('render')

  useEffect(() => {
    console.log('sdf')
    setSearchValue('')
    init()
  }, [id, init])

  return playlist.id ? (
    <div className="playlist-detail">
      <DetailHeader playlist={playlist} songs={songs} />
      <div className="tabs-wrap">
        <Tabs
          tabs={tabs}
          active={activeTab}
          type="theme"
          onActiveTabChange={onTabChange}
        />
        {activeTab === SONG_IDX ? (
          <Input
            className={inputFocus ? 'inactive input' : 'input'}
            onBlur={onBlur}
            onFocus={onFocus}
            placeholder="搜索歌单歌曲"
            icon="search"
            onChange={onInputChange}
            value={searchValue}
          />
        ) : null}
      </div>
      {searchValue && !filteredSongs.length ? (
        <div className="empty">
          未能找到和 <span className="keyword">‘{searchValue}’</span>
          相关的任何音乐
        </div>
      ) : null}
      {activeTab === SONG_IDX ? (
        <SongTable
          highlightText={searchValue}
          songs={filteredSongs}
          className="table"
        />
      ) : null}
      {activeTab === COMMENT_IDX ? (
        <div className="comments">
          <Comments id={id} onUpdate={onCommentsUpdate} type="playlist" />
        </div>
      ) : null}
    </div>
  ) : null
})
