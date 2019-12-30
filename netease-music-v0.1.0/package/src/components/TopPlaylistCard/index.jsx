import React, { memo } from 'react'
import { useHistory } from 'react-router-dom'

import { genImgUrl } from '../../utils/common'

import './index.scss'

export default memo(function TopPlaylistCard({ id, img, name, desc }) {
  const history = useHistory()

  const onClickCard = () => {
    history.push(`/playlist/${id}`)
  }

  return (
    <div className="wrap" onClick={onClickCard}>
      <div className="top-playlist-card">
        <div className="img-wrap">
          <img src={genImgUrl(img, 200)} alt="playlist-card" />
        </div>
        <div className="content">
          <div className="tag-wrap">
            <span>精品歌单</span>
          </div>
          <p className="name">{name}</p>
          <p className="desc">{desc}</p>
        </div>
      </div>
      <div
        className="background"
        style={{ backgroundImage: `url(${img})` }}
      ></div>
      <div className="background-mask"></div>
    </div>
  )
})
