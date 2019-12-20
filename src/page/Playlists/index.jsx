import React, { memo, useRef, useCallback, useState, useEffect } from 'react'

import TopPlaylistCard from '../../components/TopPlaylistCard'
import Tabs from '../../base/Tabs'
import Pagination from '../../base/Pagination'
import { getPlaylists, getTopPlaylists } from '../../api/playlist'
import { getPageOffset, formatNumber } from '../../utils/common'
import { scrollInto } from '../../utils/dom'
import PlaylistCard from '../../components/PlaylistCard'

import './index.scss'

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
  const [topPlaylist, setTopPlaylist] = useState({})
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [playlists, setPlaylists] = useState([])

  const _getPlaylists = useCallback(async () => {
    const { playlists, total } = await getPlaylists({
      limit: PAGE_SIZE,
      offset: getPageOffset(currentPage, PAGE_SIZE),
      cat: tabs[activeTabIndex]
    })
    setPlaylists(playlists)
    setTotal(total)
  }, [activeTabIndex, currentPage])

  const _getTopPlaylists = useCallback(async () => {
    const { playlists } = await getTopPlaylists({
      limit: 1,
      cat: tabs[activeTabIndex]
    })
    setTopPlaylist(playlists[0] || {})
  }, [activeTabIndex])

  const initData = useCallback(() => {
    _getPlaylists()
    _getTopPlaylists()
  }, [_getTopPlaylists, _getPlaylists])

  const onTabChange = useCallback(
    index => {
      setActiveTabIndex(index)
      initData()
    },
    [initData]
  )

  const onPageChange = useCallback(page => {
    setCurrentPage(page)
    _getPlaylists()
    scrollInto(playlistsRef.current)
  }, [_getPlaylists])

  useEffect(() => {
    _getPlaylists()
    _getTopPlaylists()
  }, [_getPlaylists, _getTopPlaylists])

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
      <div className="tabs">
        <Tabs
          tabs={tabs}
          active={activeTabIndex}
          onActiveTabChange={onTabChange}
          align="right"
          type="small"
        />
      </div>
      <div className="playlist-cards">
        {playlists.map(item => (
          <PlaylistCard
            desc={`播放量: ${formatNumber(item.playCount)}`}
            id={item.id}
            key={item.id}
            name={item.name}
            img={item.coverImgUrl}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        total={total}
        onPageChange={onPageChange}
        className="pagination"
      />
    </div>
  )
})
