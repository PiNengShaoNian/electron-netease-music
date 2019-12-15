import React, { memo, useRef, currentPage, useCallback, useState } from 'react'

import TopPlaylistCard from '../../components/TopPlaylistCard'
import { getPlaylists, getTopPlaylists } from '../../api/playlist'
import { getPageOffset } from '../../utils/common'
import { scrollInto } from '../../utils/dom'

const PAGE_SIZE = 50
const tabs = [
  '全部',
  '欧美',
  '华语',
  '流行',
  '说唱',
  '摇滚',
  '民谣',
  '电子',
  '轻音乐',
  '影视原声',
  'ACG',
  '怀旧',
  '治愈',
  '旅行'
]

export default memo(function Playlists() {
  const playlistsRef = useRef()
  const [currentPage, setCurrentPage] = useState(0)
  const [total, setTotal] = useState(0)
  const { topPlaylist, setTopPlaylist } = useState({})
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [playlists, setPlaylists] = useState([])

  const getPlaylists = useCallback(async () => {
    const { playlists, total } = await getPlaylists({
      limit: PAGE_SIZE,
      offset: getPageOffset(currentPage, PAGE_SIZE),
      cat: tabs[activeTabIndex]
    })
    setPlaylists(playlists)
    setTotal(total)
  }, [])

  const getTopPlaylists = useCallback(async () => {
    const { playlists } = await getTopPlaylists({
      limit: 1,
      cat: tabs[activeTabIndex]
    })
    setTopPlaylist(playlists[0] || {})
  })

  const initData = useCallback(() => {
    getPlaylists()
    getTopPlaylists()
  }, [getPlaylists])

  return (
    <div className="playlists" ref={playlistsRef}>
      {topPlaylist.id ? (
        <div className="top-play-list-card">
          <TopPlaylistCard
            desc={topPlaylist.description}
            id={topPlaylist.id}
            img={topPlaylist.coverImgUrl}
            name={topPlaylist.name}
          />
        </div>
      ) : null}
    </div>
  )
})
