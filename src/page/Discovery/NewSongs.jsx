import React, { memo, useCallback, useState, useEffect, useMemo } from 'react'
import { bindActionCreators } from 'redux'
import { useDispatch } from 'react-redux'

import Title from '../../base/Title'
import SongCard from '../../components/SongCard'
import { getNewSongs } from '../../api/discovery'
import { createSong } from '../../utils/business'
import { startSong, setPlaylist } from '../../action/music'

const styles = {
  newSongs: {
    marginBottom: 36
  },
  listWrap: {
    display: 'flex'
  },
  list: {
    flex: 1,
    overflow: 'hidden'
  }
}

const songsLimit = 10
const chunkLimit = Math.ceil(songsLimit / 2)
export default memo(function NewSongs() {
  const [list, setList] = useState([])
  const dispatch = useDispatch()

  const bindedActions = useMemo(() => {
    return bindActionCreators({
      startSong,
      setPlaylist
    }, dispatch)
  }, [dispatch])

  const thunkedList = useMemo(() => {
    return [list.slice(0, chunkLimit), list.slice(chunkLimit, list.length)]
  }, [list])

  const normalizeSong = useCallback(song => {
    const {
      id,
      name,
      song: {
        mvid,
        artists,
        album: { blurPicUrl },
        duration
      }
    } = song
    return createSong({
      id,
      name,
      img: blurPicUrl,
      artists,
      duration,
      mvId: mvid
    })
  }, [])

  const normalizedSongs = useMemo(() => {
    return list.map(song => normalizeSong(song))
  }, [list, normalizeSong])

  const getSongOrder = useCallback((listIndex, index) => {
    return listIndex * chunkLimit + index + 1
  }, [])

  const onClickSong = useCallback((listIndex, index) => {
    const normalizedSongIndex = getSongOrder(listIndex, index)
    const normalizedSong = normalizedSongs[normalizedSongIndex]
    bindedActions.startSong(normalizedSong)
    bindedActions.setPlaylist(normalizedSongs)
  }, [bindedActions, getSongOrder, normalizedSongs])

  useEffect(() => {
    ;(async () => {
      const { result } = await getNewSongs()
      setList(result)
    })()
  })
  return list.length ? (
    <div className="new-songs" style={styles.newSongs}>
      <Title>最新音乐</Title>
      <div className="list-wrap" style={styles.listWrap}>
        {thunkedList.map((list, listIndex) => (
          <div className="list" key={listIndex} style={styles.list}>
            {list.map((item, index) => (
              <SongCard
                key={item.id}
                order={getSongOrder(listIndex, index)}
                onClick={() => onClickSong(listIndex, index)}
                className="song-card"
                {...normalizeSong(item)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  ) : null
})
