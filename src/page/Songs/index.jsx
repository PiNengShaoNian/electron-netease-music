import React, { memo, useCallback, useState, useEffect } from 'react'

import Tabs from '../../base/Tabs'
import SongTable from '../../components/SongTable'
import { getTopSongs } from '../../api/song'
import { createSong } from '../../utils/business'

const tabs = [
  { title: '全部', type: 0 },
  { title: '华语', type: 7 },
  { title: '欧美', type: 96 },
  { title: '日本', type: 8 },
  { title: '韩国', type: 16 }
]

const styles = {
  songs: {
    padding: 12
  },
  headerRow: {
    display: 'none'
  }
}

export default memo(function Songs() {
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [songs, setSongs] = useState([])
  const onChange = useCallback(
    async index => {
      if (typeof index === 'number') {
        setActiveTabIndex(index)
      }
      
      const { data } = await getTopSongs(tabs[activeTabIndex].type)
      const songs = data.map(song => {
        const {
          id,
          name,
          artists,
          duration,
          mvid,
          album: { picUrl, name: albumName }
        } = song
        return createSong({
          id,
          name,
          artists,
          duration,
          albumName,
          img: picUrl,
          mvId: mvid
        })
      })
      setSongs(songs)
    },
    [activeTabIndex]
  )

  useEffect(() => {
    onChange()
  }, [onChange])
  return (
    <div className="songs" style={styles.songs}>
      <div className="tabs">
        <Tabs
          tabs={tabs}
          onActiveTabChange={onChange}
          active={activeTabIndex}
          align="right"
          type="small"
        />
      </div>
      <SongTable songs={songs} headerRowClassName="header-row" showHeader={false}/>
    </div>
  )
})
