import React, { memo, useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import PlayIcon from '../../base/PlayIcon'
import { genImgUrl } from '../../utils/common'

import './index.scss'

export default memo(function PlaylistCard({ id, img, name, desc }) {
  const history = useHistory()

  const onClickCard = useCallback(() => {
    history.push(`/playlist/${id}`)
  }, [id, history])

  return (
    <div onClick={onClickCard} className="playlist-card">
      <div className="img-wrap">
        <img src={genImgUrl(img, 300)} alt="" />
        {desc ? (
          <div className="desc-wrap">
            <span className="desc">{desc}</span>
          </div>
        ) : null}
        <PlayIcon size={36} className="play-icon" />
      </div>
      <p className="name">{name}</p>
    </div>
  )
})
