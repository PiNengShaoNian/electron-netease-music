import React, { memo, useMemo, useContext, useState, useCallback } from 'react'

import WithPagination from '../../components/WithPagination'
import { getSearch } from '../../api/search'
import PlaylistCard from '../../components/PlaylistCard'
import { formatNumber } from '../../utils/common'
import { SearchRootContext } from './index'

import './Playlists.scss'

const SEARCH_TYPE_PLAYLIST = 1000

export default memo(function SearchPlaylists() {
  const searchRoot = useContext(SearchRootContext)
  const [playlists, setPlaylists] = useState([])
  const [playlistCount, setPlaylistCount] = useState(0)

  const searchParams = useMemo(() => {
    return { keywords: searchRoot.keywords, type: SEARCH_TYPE_PLAYLIST }
  }, [searchRoot])

  const onGetPlaylists = useCallback(
    ({ result: { playlists, playlistCount } }) => {
      setPlaylists(playlists)
      setPlaylistCount(playlistCount)
      searchRoot.onUpdateCount(playlistCount)
    },
    [searchRoot]
  )

  return (
    <div className="search-playlists">
      <WithPagination
        getData={getSearch}
        getDataParams={searchParams}
        limit={50}
        scrollTarget={searchRoot.header && searchRoot.header.current}
        total={playlistCount}
        onGetDataSuccess={onGetPlaylists}
      >
        <div className="list-wrap">
          {playlists.map(item => (
            <PlaylistCard
              desc={`播放量: ${formatNumber(item.playCount)}`}
              id={item.id}
              img={item.coverImgUrl}
              key={item.id}
              name={item.name}
            />
          ))}
        </div>
      </WithPagination>
    </div>
  )
})
