import React, { memo, useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import { genImgUrl, formatNumber, formatTime, isDef } from '../../utils/common'
import PlayIcon from '../../base/PlayIcon'
import Icon from '../../base/Icon'

import './index.scss'

export default memo(function MvCard({
  id,
  img,
  duration,
  playCount,
  name,
  author
}) {
  const history = useHistory()

  const goMv = useCallback(() => {
    if (isDef(id)) {
      history.push(`/mv/${id}`)
    }
  }, [id, history])

  return (
    <div className="mv-card" onClick={goMv}>
      <div className="img-wrap">
        <img src={genImgUrl(img, 500, 260)} alt="mv" />
        {playCount ? (
          <div className="play-count-wrap">
            <Icon type="play" />
            {formatNumber(playCount)}
          </div>
        ) : null}
        <div className="play-icon-wrap">
          <PlayIcon size={48} className="play-icon" />
        </div>
        {duration ? (
          <div className="duration-wrap">{formatTime(duration / 1000)}</div>
        ) : null}
      </div>
      {name ? <p className="name">{name}</p> : null}
      {author ? <p className="author">{author}</p> : null}
    </div>
  )
})
