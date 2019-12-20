import React, {
  memo,
  useRef,
  useCallback,
  useMemo,
  useState,
  useEffect
} from 'react'
import { CSSTransition } from 'react-transition-group'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import Scroller from '../../base/Scroller'
import Card from '../../base/Card'
import Icon from '../../base/Icon'
import Comments from '../Comments'
import PlayIcon from '../../base/PlayIcon'
import Loading from '../../base/Loading'
import { genImgUrl, isDef, formatNumber } from '../../utils/common'
import { goMvWithCheck, createSong } from '../../utils/business'
import { usePrevious } from '../../utils/hooks'
import lyricParser from '../../utils/lrcparse'
import { setPlayerShow, addToPlaylist, startSong } from '../../action/music'
import Empty from '../../base/Empty'
import { getLyric, getSimiSongs } from '../../api/song'

import './index.scss'
import { getSimiPlaylists } from '../../api/playlist'

const WHEEL_TYPE = 'wheel'
const SCROLL_TYPE = 'scroll'
const AUTO_SCROLL_RECOVER_TIME = 1000

export default memo(function Player() {
  const isPlayerShow = useSelector(({ music }) => music.isPlayerShow)
  const playing = useSelector(({ music }) => music.playing)
  const currentSong = useSelector(({ music }) => music.currentSong)
  const currentTime = useSelector(({ music }) => music.currentTime)
  const dispatch = useDispatch()
  const history = useHistory()
  const [nolyric, setNolyric] = useState(false)
  const [lyric, setLyric] = useState([])
  const [tlyric, setTlyric] = useState([])
  const [simiPlaylists, setSimiPlaylists] = useState([])
  const [simiSongs, setSimiSongs] = useState([])
  const [simiLoading, setSimiLoading] = useState(false)
  const oldSong = usePrevious(currentSong)
  const disc = useRef()
  const discRotate = useRef()
  const scrollerRef = useRef()
  const lyricRef = useRef()
  const commentsRef = useRef()
  const lyricTimer = useRef({
    [WHEEL_TYPE]: null,
    [SCROLL_TYPE]: null
  })
  const lyricScrolling = useRef({
    [WHEEL_TYPE]: false,
    [SCROLL_TYPE]: false
  })
  const { id } = useParams()

  const bindedActions = useMemo(() => {
    return bindActionCreators(
      {
        setPlayerShow,
        addToPlaylist,
        startSong
      },
      dispatch
    )
  }, [dispatch])

  const lyricWithTranslation = useMemo(() => {
    let ret = []
    const lyricFiltered = lyric.filter(({ content }) => Boolean(content))

    if (lyricFiltered.length) {
      lyricFiltered.forEach(l => {
        const { time, content } = l
        const lyricItem = { time, content, contents: [content] }
        const sameTimeTLyric = tlyric.find(
          ({ time: tLyricTime }) => tLyricTime === time
        )
        if (sameTimeTLyric) {
          const { content: tLyricContent } = sameTimeTLyric
          if (content) {
            lyricItem.contents.push(tLyricContent)
          }
        }
        ret.push(lyricItem)
      })
    } else {
      ret = lyricFiltered.map(({ time, content }) => ({
        time,
        content,
        contents: [content]
      }))
    }
    return ret
  }, [lyric, tlyric])

  const activeLyricIndex = useMemo(() => {
    return lyricWithTranslation
      ? lyricWithTranslation.findIndex((l, index) => {
          const nextLyric = lyricWithTranslation[index + 1]
          return (
            currentTime >= l.time &&
            (nextLyric ? currentTime < nextLyric.time : true)
          )
        })
      : -1
  }, [lyricWithTranslation, currentTime])

  const oldIndex = usePrevious(activeLyricIndex)

  const onGoMv = useCallback(() => {
    bindedActions.setPlayerShow(false)
    goMvWithCheck(currentSong.id, history)
  }, [bindedActions, history, currentSong])

  const updateLyric = useCallback(async () => {
    const result = await getLyric(currentSong.id)
    const nolyric = !isDef(result.lrc) || !result.lrc.lyric
    setNolyric(nolyric)
    if (!nolyric) {
      const { lyric, tlyric } = lyricParser(result)
      setLyric(lyric)
      setTlyric(tlyric)
    }
  }, [currentSong])

  const updateSimi = useCallback(async () => {
    setSimiLoading(true)
    const [simiPlaylists, simiSongs] = await Promise.all([
      getSimiPlaylists(currentSong.id),
      getSimiSongs(currentSong.id)
    ]).finally(() => {
      setSimiLoading(false)
    })
    setSimiPlaylists(simiPlaylists)
    setSimiSongs(
      simiSongs.songs.map(song => {
        const {
          id,
          name,
          artists,
          mvid,
          album: { picUrl },
          duration
        } = song
        return createSong({
          id,
          name,
          artists,
          duration,
          img: picUrl,
          mvId: mvid
        })
      })
    )
  }, [currentSong])

  const updateSong = useCallback(() => {
    updateLyric()
    updateSimi()
  }, [updateLyric])

  const clearTimer = useCallback(type => {
    lyricTimer.current[type] && window.clearTimeout(lyricTimer.current[type])
  }, [])

  const onInitScroller = useCallback(
    scroller => {
      const onScrollStart = type => {
        clearTimer(type)
        lyricScrolling.current[type] = true
      }

      const onScrollEnd = type => {
        clearTimer(type)
        lyricTimer.current[type] = setTimeout(() => {
          lyricScrolling.current[type] = false
        }, AUTO_SCROLL_RECOVER_TIME)
      }

      scroller.on('scrollStart', onScrollStart.bind(null, SCROLL_TYPE))
      scroller.on('mousewheelStart', onScrollStart.bind(null, WHEEL_TYPE))

      scroller.on('scrollEnd', onScrollEnd.bind(null, SCROLL_TYPE))
      scroller.on('mousewheelEnd', onScrollEnd.bind(null, WHEEL_TYPE))
    },
    [clearTimer]
  )

  const getActiveCls = useCallback(
    index => {
      return activeLyricIndex === index ? 'active' : ''
    },
    [activeLyricIndex]
  )

  const scrollToActiveLyric = useCallback(() => {
    if (activeLyricIndex !== -1) {
      if (lyric.current && lyric.current[activeLyricIndex]) {
        scrollerRef.current
          .getInstance()
          .getScroller()
          .scrollToElement(lyricRef.current[activeLyricIndex], 200, 0, true)
      }
    }
  }, [activeLyricIndex, lyric])

  const onClickPlaylist = useCallback(
    _id => {
      if (_id === Number(id)) {
        bindedActions.setPlayerShow(false)
      } else {
        history.push(`/playlist/${id}`)
      }
    },
    [id, bindedActions, history]
  )

  const onClickSong = useCallback((song) => {
    bindedActions.startSong(song)
    bindedActions.addToPlaylist(song)
  }, [bindedActions])

  useEffect(() => {
    if (!currentSong.id) {
      bindedActions.setPlayerShow(false)
      return
    }

    if (currentSong.id === oldSong.id) {
      return
    }

    if (isPlayerShow) {
      updateSong()
    } else {
      updateLyric()
    }
  }, [currentSong, oldSong, bindedActions, isPlayerShow, updateSong, updateLyric])

  useEffect(() => {
    if (
      activeLyricIndex !== oldIndex &&
      !lyricScrolling[WHEEL_TYPE] &&
      !lyricScrolling[SCROLL_TYPE]
    ) {
      scrollToActiveLyric()
    }
  }, [activeLyricIndex, oldIndex, scrollToActiveLyric])

  return (
    <CSSTransition classNames="slide" in={isPlayerShow} timeout={500}>
      <div className="player">
        <div className="content">
          <div className="song">
            <div className="left">
              <img
                src={require('../../assets/image/play-bar-support.png')}
                alt=""
                className="play-bar-support"
              />
              <img
                src={require('../../assets/image/play-bar.png')}
                alt=""
                className={playing ? 'playing play-bar' : 'play-bar'}
              />
              <div className="img-outer-border" ref={disc}>
                <div
                  className={playing ? 'img-outer' : 'paused img-outer'}
                  ref={discRotate}
                >
                  <div className="img-wrap">
                    <img src={genImgUrl(currentSong.img, 400)} alt="" />
                  </div>
                </div>
              </div>
            </div>

            <div className="right">
              <div className="name-wrap">
                <p className="name">{currentSong.name}</p>
                {currentSong.mvId ? (
                  <span className="mv-tag" onClick={onGoMv}>
                    MV
                  </span>
                ) : null}
              </div>
              <div className="desc">
                <div className="desc-item">
                  <span className="label">歌手：</span>
                  <div className="value">{currentSong.artistsText}</div>
                </div>
              </div>
              {nolyric ? (
                <Empty children="还没有歌词喔~" />
              ) : (
                <Scroller
                  data={lyric}
                  options={{ disableTouch: true }}
                  onInit={onInitScroller}
                  className="lyric-wrap"
                  ref={scrollerRef}
                >
                  <div>
                    {lyricWithTranslation.map((l, index) => (
                      <div
                        className={`${getActiveCls(index)} lyric-item`}
                        key={index}
                        ref={lyricRef}
                      >
                        {l.contents.map((content, contentIndex) => (
                          <p className="lyric-text" key={contentIndex}>
                            {content}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </Scroller>
              )}
            </div>
          </div>
          <div className="bottom">
            <div className="left">
              {currentSong.id ? (
                <Comments id={currentSong.id} ref={commentsRef} />
              ) : null}
            </div>
            {simiPlaylists.concat(simiSongs).length ? (
              <div className="right">
                {simiLoading ? (
                  <Loading />
                ) : (
                  <div>
                    {simiPlaylists.length ? (
                      <div className="simi-playlists">
                        <p className="title">包含这首歌的歌单</p>
                        {simiPlaylists.map(simiPlaylist => (
                          <div className="simi-item" key={simiPlaylist.id}>
                            <Card
                              img={simiPlaylist.coverImgUrl}
                              name={simiPlaylist.name}
                              onClick={onClickPlaylist(simiPlaylist.id)}
                              desc={
                                <div className="desc">
                                  <Icon size={12} color="shallow" type="play" />
                                  <p className="count">
                                    {formatNumber(simiPlaylist.playCount)}
                                  </p>
                                </div>
                              }
                            />
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {simiSongs.map(simiSong => (
                      <div className="simi-item" key={simiSong.id}>
                        <Card
                          desc={simiSong.artistsText}
                          img={simiSong.img}
                          name={simiSong.name}
                          onClick={onClickSong(simiSong)}
                          imgMask={<PlayIcon className="play-icon" />}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </CSSTransition>
  )
})
