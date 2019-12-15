import React, { memo } from 'react'

import Banner from './Banner'
import NewPlaylists from './NewPlaylists'
import NewSongs from './NewSongs'
import NewMvs from './NewMvs'

const style = {
  padding: '18px 32px'
}
export default memo(function Discovery() {
  return (
    <div className="discovery" style={style}>
      <div className="discovery-content">
        <Banner />
        <NewPlaylists />
        <NewSongs />
        <NewMvs />
      </div>
    </div>
  )
})
