import React, { memo, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

import VideoPlayer from '../../base/VideoPlayer'
import Comments from '../../components/Comments'
import Card from '../../base/Card'
import MvCard from '../../components/MvCard'
import { isDef, genImgUrl, formatDate } from '../../utils/common'
import { getMvDetail, getSimiMv, getMvUrl } from '../../api/mv'
import { getArtists } from '../../api/artist'
import { setPlayingState } from '../../action/music'

import './index.scss'
import { goMv } from '../../utils/business'

const genResource = (brs, mvPlayInfo) => {
  const { url: mvPlayInfoUrl, r: mvPlayInfoBr } = mvPlayInfo
  const keyNameMap = {
    240: '标清',
    480: '高清',
    720: '超清',
    1080: '1080p'
  }

  return Object.keys(brs).map(key => {
    const findPreferUrl = key === mvPlayInfoBr
    const name = keyNameMap[key]
    const url = findPreferUrl ? mvPlayInfoUrl : brs[key]

    return {
      url,
      name
    }
  })
}

export default memo(function Mv() {
  const video = useRef()
  const dispatch = useDispatch()
  const { id } = useParams()
  const [mvDetail, setMvDetail] = useState({})
  const [mvPlayInfo, setMvPlayInfo] = useState('')
  const [artist, setArtist] = useState({})
  const [simiMvs, setSimiMvs] = useState([])
  const history = useHistory()
  useEffect(() => {
    ;(async () => {
      const [
        { data: mvDetail },
        { data: mvPlayInfo },
        { mvs: simiMvs }
      ] = await Promise.all([getMvDetail(id), getMvUrl(id), getSimiMv(id)])

      const { artist } = await getArtists(mvDetail.artistId)

      setMvDetail(mvDetail)
      setMvPlayInfo(mvPlayInfo)
      setArtist(artist)
      setSimiMvs(simiMvs)

      queueMicrotask(() => {
        const player = video.current.getInstance().player
        player.emit('resourceReady', genResource(mvDetail.brs, mvPlayInfo))
        player.on('play', () => {
          dispatch(setPlayingState(false))
        })
      })
    })()
  }, [dispatch, id])
  return isDef(mvDetail.id) ? (
    <div className="mv">
      <div className="mv-content">
        <div className="left">
          <p className="title">mv详情</p>
          <div className="video-player-wrap">
            <VideoPlayer url={mvPlayInfo.url} ref={video} />
          </div>

          <div className="author-wrap">
            <div className="avatar">
              <img src={genImgUrl(artist.picUrl, 120)} alt="avatar" />
            </div>
            <p className="author">{artist.name}</p>
          </div>

          <p className="name">{mvDetail.name}</p>

          <div className="desc">
            <span className="date">
              发布：{formatDate(mvDetail.publishTime, 'yyyy-MM-dd')}
            </span>
            <span className="count">播放：{mvDetail.playCount}次</span>
          </div>

          <div className="comments">
            <Comments id={id} type="mv" />
          </div>
        </div>
        <div className="right">
          <p className="title">相关推荐</p>
          <div className="simi-mvs">
            {simiMvs.map(simiMv => (
              <Card
                desc={simiMv.artistName}
                key={simiMv.id}
                name={simiMv.name}
                onClick={() => goMv(simiMv.id, history)}
                className="simi-mv-card"
                imgWrap={
                  <MvCard
                    duration={simiMv.duration}
                    img={simiMv.cover}
                    playCount={simiMv.playCount}
                  />
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : null
})
