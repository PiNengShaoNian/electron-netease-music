import React, { memo } from 'react'

import { pad, genImgUrl } from '../../utils/common'
import PlayIcon from '../../base/PlayIcon'

import './index.scss'

export default memo(function SongCard({ order, name, img, artistsText }) {
  return (
    <div className="song-card">
      <div className="order-wrap">
        <span className="order">{pad(order)}</span>
      </div>
      <div className="img-wrap">
        <img src={genImgUrl(img, 120)} alt="" />
        <PlayIcon className="play-icon" />
      </div>
      <div className="song-content">
        <p className="song-name">{name}</p>
        <p className="singer">{artistsText}</p>
      </div>
    </div>
  )
})
