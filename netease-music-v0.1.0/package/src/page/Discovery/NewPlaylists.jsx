import React, { memo, useState, useEffect } from 'react'

import Title from '../../base/Title'
import PlaylistCard from '../../components/PlaylistCard'
import { getPersonalized } from '../../api/discovery'

const style = {
  margin: '0 -4px',
  display: 'flex',
  flexWrap: 'wrap'
}

export default memo(function NewPlaylists() {
  const [list, setList] = useState([])

  useEffect(() => {
    ;(async () => {
      const { result } = await getPersonalized({ limit: 10 })
      setList(result)
    })()
  }, [])

  return list.length ? (
    <div className="recommend">
      <Title>推荐歌单</Title>
      <div className="list-wrap" style={style}>
        {list.map(item => (
          <PlaylistCard
            desc={item.copywriter}
            id={item.id}
            img={item.picUrl}
            key={item.id}
            name={item.name}
          />
        ))}
      </div>
    </div>
  ) : null
})
