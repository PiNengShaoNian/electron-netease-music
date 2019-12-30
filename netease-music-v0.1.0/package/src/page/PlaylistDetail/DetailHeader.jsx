import React, { memo, useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import NButton from '../../base/NButton'
import Icon from '../../base/Icon'
import { formatDate } from '../../utils/common'
import { genImgUrl } from '../../utils/common'
import { startSong, setPlaylist } from '../../action/music'

import './DetailHeader.scss'

export default memo(function DetailHeader({ playlist, songs }) {
  const dispatch = useDispatch()
  const tagsText = useMemo(() => {
    return playlist.tags.join('/')
  }, [playlist])

  const bindedActions = useMemo(() => {
    return bindActionCreators(
      {
        startSong,
        setPlaylist
      },
      dispatch
    )
  }, [dispatch])

  const playAll = useCallback(() => {
    bindedActions.startSong(songs[0])
    bindedActions.setPlaylist(songs)
  }, [songs, bindedActions])

  return playlist.id ? (
    <div className="header detail">
      <div className="img-wrap">
        <img src={genImgUrl(playlist.coverImgUrl, 400)} alt="" />
      </div>
      <div className="content">
        <div className="title-wrap">
          <p className="title">{playlist.name}</p>
        </div>
        <div className="creator-wrap">
          <img
            src={playlist.creator.avatarUrl}
            className="avatar"
            alt="avatar"
          />
          <p className="creator">{playlist.creator.nickname}</p>
          <p className="create-time">
            {formatDate(playlist.createTime, 'yyyy-MM-dd')} 创建
          </p>
        </div>
        <div className="action-wrap">
          <NButton onClick={playAll} className="button">
            <Icon className="icon middle" color="white" type="play-round" />
            <span className="middle">播放全部</span>
          </NButton>
        </div>
        <div className="desc-wrap">
          {tagsText ? (
            <p className="desc">
              <span>标签: {tagsText}</span>
            </p>
          ) : null}
          {playlist.description ? (
            <p className="desc">
              <span className="value">简介: {playlist.description}</span>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  ) : null
})
