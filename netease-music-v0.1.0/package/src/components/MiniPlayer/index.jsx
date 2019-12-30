import React, {
  memo,
  useMemo,
  useCallback,
  useState,
  useRef,
  useEffect
} from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import storage from 'good-storage'
import { bindActionCreators } from 'redux'
import { Popover } from 'element-react'

import Icon from '../../base/Icon'
import Share from '../Share'
import Volume from '../../base/Volume'
import ProgressBar from '../../base/ProgressBar'
import { genImgUrl, isDef, formatDate, formatTime } from '../../utils/common'
import {
  startSong,
  setPlayMode,
  setPlaylistShow,
  setCurrentTime,
  setPlayingState,
  setPlayerShow
} from '../../action/music'
import { playModeMap, VOLUME_KEY } from '../../utils/config'
import { usePrevious } from '../../utils/hooks'
import * as getters from '../../store/getters'

import './index.scss'

const DEFAULT_VOLUME = 0.75
storage.set(VOLUME_KEY, 0.75)
const volume = storage.get(VOLUME_KEY, DEFAULT_VOLUME)

export default memo(function MiniPlayer() {
  const currentSong = useSelector(({ music }) => music.currentSong)
  const isPlayerShow = useSelector(({ music }) => music.isPlayerShow)
  const currentTime = useSelector(({ music }) => music.currentTime)
  const playing = useSelector(({ music }) => music.playing)
  const playMode = useSelector(({ music }) => music.playMode)
  const nextSong = useSelector(getters.nextSong, shallowEqual)
  const prevSong = useSelector(getters.prevSong, shallowEqual)
  const isPlaylistShow = useSelector(({ music }) => music.isPlaylistShow)
  const isPlaylistPromptShow = useSelector(
    ({ music }) => music.isPlaylistPromptShow
  )
  const songReady = useRef(false)
  const audio = useRef()
  const oldSong = usePrevious(currentSong)
  const timer = useRef()
  const dispatch = useDispatch()

  const [isPlayErrorPromptShow, setIsPlayErrorPromptShow] = useState(false)

  const bindedActions = useMemo(() => {
    return bindActionCreators(
      {
        startSong,
        setPlayMode,
        setPlaylistShow,
        setCurrentTime,
        setPlayingState,
        setPlayerShow
      },
      dispatch
    )
  }, [dispatch])

  const shareUrl = useMemo(() => {
    return `${window.location.origin}?shareMusicId=${currentSong.id}`
  }, [currentSong])

  const playIcon = useMemo(() => {
    return playing ? 'pause' : 'play'
  }, [playing])

  const hasCurrentSong = useMemo(() => {
    return isDef(currentSong.id)
  }, [currentSong])

  const playedPercent = useMemo(() => {
    const { durationSecond } = currentSong
    return Math.min(currentTime / durationSecond, 1) || 0
  }, [currentSong, currentTime])

  const playControlIcon = useMemo(() => {
    return isPlayerShow ? 'shrink' : 'open'
  }, [isPlayerShow])

  const currentMode = useMemo(() => {
    return playModeMap[playMode]
  }, [playMode])

  const modeIcon = useMemo(() => {
    return currentMode.icon
  }, [currentMode])

  const playModeText = useMemo(() => {
    return currentMode.name
  }, [currentMode])

  const prev = useCallback(() => {
    if (songReady) {
      bindedActions.startSong(prevSong)
    }
  }, [songReady, bindedActions, prevSong])

  const next = useCallback(() => {
    if (songReady.current) {
      bindedActions.startSong(nextSong)
    }
  }, [bindedActions, nextSong])

  const ready = useCallback(() => {
    songReady.current = true
  }, [])

  const updateTime = useCallback(
    e => {
      const time = e.target.currentTime
      bindedActions.setCurrentTime(time)
    },
    [bindedActions]
  )

  const end = useCallback(() => {
    next()
  }, [next])

  const onChangePlayMode = useCallback(() => {
    const modeKeys = Object.keys(playModeMap)
    const currentModeIndex = modeKeys.findIndex(
      key => playModeMap[key].code === playMode
    )

    const nextIndex = (currentModeIndex + 1) % modeKeys.length
    const nextModeKey = modeKeys[nextIndex]
    const nextMode = playModeMap[nextModeKey]
    bindedActions.setPlayMode(nextMode.code)
  }, [bindedActions, playMode])

  const togglePlaylistShow = useCallback(() => {
    bindedActions.setPlaylistShow(!isPlaylistShow)
  }, [isPlaylistShow, bindedActions])

  const onVolumeChange = useCallback(percent => {
    audio.current.volume = percent
    storage.set(VOLUME_KEY, percent)
  }, [])

  const onProgressChange = useCallback(
    percent => {
      audio.current.currentTime = currentSong.durationSecond * percent
    },
    [currentSong]
  )

  const togglePlaying = useCallback(() => {
    if (!currentSong.id) {
      return
    }
    bindedActions.setPlayingState(!playing)
  }, [currentSong, playing, bindedActions])

  const togglePlayerShow = useCallback(() => {
    bindedActions.setPlayerShow(!isPlayerShow)
  }, [isPlayerShow, bindedActions])

  const play = useCallback(async () => {
    if (songReady.current) {
      try {
        await audio.current.play()
        if (isPlayErrorPromptShow) {
          setIsPlayErrorPromptShow(false)
        }
      } catch (error) {
        setIsPlayErrorPromptShow(true)
        bindedActions.setPlayingState(false)
      }
    }
  }, [bindedActions, isPlayErrorPromptShow])

  const pause = useCallback(() => {
    audio.current.pause()
  }, [])

  useEffect(() => {
    if (!currentSong.id) {
      audio.current.pause()
      audio.current.currentTime = 0
      return
    }

    if (oldSong && currentSong.id === oldSong.id) {
      bindedActions.setCurrentTime(0)
      audio.current.currentTime = 0
      play()
      return
    }

    songReady.current = false

    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = setTimeout(() => {
      play()
    }, 1000)
  }, [currentSong, bindedActions, play, oldSong])

  useEffect(() => {
    queueMicrotask(() => {
      playing ? play() : pause()
    })
  }, [playing, pause, play])

  return (
    <div className="mini-player" id="mini-player">
      <div className="song">
        {hasCurrentSong ? (
          <>
            <div className="img-wrap" onClick={togglePlayerShow}>
              <div className="mask"></div>
              <img
                src={genImgUrl(currentSong.img, 80)}
                alt="mini-player"
                className="blur"
              />
              <div className="player-control">
                <Icon size={24} type={playControlIcon} color="white" />
              </div>
            </div>
            <div className="content">
              <div className="top">
                <p className="name">{currentSong.name}</p>
                <p className="split">-</p>
                <p className="artists">{currentSong.artistsText}</p>
              </div>
              <div className="time">
                <span className="played-time">{formatDate(currentTime)}</span>
                <span className="split">/</span>
                <span className="total-time">
                  {formatTime(currentSong.duration / 1000)}
                </span>
              </div>
            </div>
          </>
        ) : null}
      </div>

      <div className="control">
        <Icon size={24} onClick={prev} className="icon" type="prev" />
        <Popover
          width="160"
          placement="top"
          visible={isPlayErrorPromptShow}
          content={<p>请点击开始播放</p>}
          children={
            <div className="play-icon" onClick={togglePlaying}>
              <Icon size={24} type={playIcon} />
            </div>
          }
        />
        <Icon size={24} onClick={next} className="icon" type="next" />
      </div>

      <div className="mode">
        {hasCurrentSong ? (
          <Share shareUrl={shareUrl} className="mode-item" />
        ) : null}

        <Popover
          placement="top"
          trigger="hover"
          width={160}
          content={<p>{playModeText}</p>}
          children={
            <Icon
              size={20}
              type={modeIcon}
              onClick={onChangePlayMode}
              className="mode-item"
            />
          }
        />

        <Popover
          visible={isPlaylistPromptShow}
          placement="top"
          width={160}
          content={<p>已更新歌单</p>}
          children={
            <Icon
              size={20}
              onClick={togglePlaylistShow}
              className="mode-item"
              type="playlist"
            />
          }
        />

        <div className="volume-item">
          <Volume volume={volume} onVolumeChange={onVolumeChange} />
        </div>
      </div>
      <div className="progress-bar-wrap">
        <ProgressBar
          disabled={!hasCurrentSong}
          percent={playedPercent}
          onPercentChange={onProgressChange}
        />
      </div>
      <audio
        src={currentSong.url}
        onCanPlay={ready}
        onEnded={end}
        onTimeUpdate={updateTime}
        ref={audio}
      ></audio>
    </div>
  )
})
