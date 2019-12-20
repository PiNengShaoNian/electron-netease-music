import React, { memo, useMemo, useContext, useCallback, useState } from 'react'

import WithPagination from '../../components/WithPagination'
import SongTable from '../../components/SongTable'
import HighlightText from '../../base/HighlightText'
import { getSearch } from '../../api/search'

import { SearchRootContext } from './index'
import { createSong } from '../../utils/business'

import './Songs.scss'

export default memo(function Songs() {
  const searchRoot = useContext(SearchRootContext)
  const [songs, setSongs] = useState([])
  const [songCount, setSongCount] = useState(0)
  const keywords = useMemo(() => {
    return searchRoot && searchRoot.keywords
  }, [searchRoot])

  const searchParams = useMemo(() => {
    return { keywords: keywords }
  }, [keywords])

  const renderNameDesc = useCallback(
    ({ row }) => {
      const { alias } = row
      return alias.map(desc => (
        <HighlightText
          className="name-desc"
          text={desc}
          key={desc}
          highlightText={keywords}
        />
      ))
    },
    [keywords]
  )

  const onGetSearch = useCallback(
    result => {
      const {
        result: { songs, songCount }
      } = result
      const nextSongs = songs.map(song => {
        const { id, mvid, name, alias, artists, duration, album } = song

        return createSong({
          id,
          name,
          alias,
          artists,
          duration,
          mvId: mvid,
          albumName: album.name,
          albumId: album.id
        })
      })
      
      setSongs(nextSongs)
      setSongCount(songCount)
      searchRoot.onUpdateCount(songCount)
    },
    [searchRoot]
  )
  return (
    <div className="search-songs">
      <WithPagination
        getData={getSearch}
        getDataParams={searchParams}
        limit={30}
        scrollTarget={searchRoot.header && searchRoot.header.current}
        total={songCount}
        onGetDataSuccess={onGetSearch}
      >
        <div className="table">
          <SongTable
            highlightText={keywords}
            renderNameDesc={renderNameDesc}
            songs={songs}
            stripe={true}
          />
        </div>
      </WithPagination>
    </div>
  )
})
