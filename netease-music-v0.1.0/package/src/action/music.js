import storage from 'good-storage'
import actionTypes from './actionTypes'
import { PLAY_HISTORY_KEY } from '../utils/config'
import { notify } from '../utils/common'
import { getSongImg } from '../utils/business'
import { getSongUrl } from '../api/song'

export const setPlayerShow = show => {
  return {
    type: actionTypes.SET_PLAYER_SHOW,
    payload: show
  }
}

export const clearCurrentSong = () => {
  return dispatch => {
    dispatch({ type: actionTypes.SET_CURRENT_SONG, payload: {} })
    dispatch({ type: actionTypes.SET_PLAYING_STATE, payload: false })
    dispatch({ type: actionTypes.SET_CURRENT_TIME, payload: 0 })
  }
}

export const setPlaylist = payload => {
  return dispatch => {
    dispatch({
      type: actionTypes.SET_PLAYLIST,
      payload
    })
  }
}

export const setPlayingState = payload => {
  return dispatch => {
    dispatch({
      type: actionTypes.SET_PLAYING_STATE,
      payload
    })
  }
}

export const setCurrentTime = payload => {
  return dispatch => {
    dispatch({
      type: actionTypes.SET_CURRENT_TIME,
      payload
    })
  }
}

export const startSong = rawSong => {
  return async (dispatch, getState) => {
    const song = Object.assign({}, rawSong)
    if (!song.img) {
      if (song.albumId) {
        song.img = await getSongImg(song.id, song.albumId)
      }
    }
    dispatch({
      type: actionTypes.SET_CURRENT_SONG,
      payload: song
    })
    dispatch({
      type: actionTypes.SET_PLAYING_STATE,
      payload: true
    })

    const {
      music: { playHistory }
    } = getState()
    const playHistoryCopy = playHistory.slice()
    const findedIndex = playHistoryCopy.findIndex(({ id }) => song.id === id)
    if (findedIndex !== -1) {
      playHistoryCopy.splice(findedIndex, 1)
    }
    playHistoryCopy.unshift(song)
    dispatch({ type: actionTypes.SET_PLAY_HISTORY, payload: playHistoryCopy })
    storage.set(PLAY_HISTORY_KEY, playHistoryCopy)
    const canPlay = await checkCanPlay(song.id)
    if (!canPlay) {
      notify(`${song.name}播放失败`)
      dispatch(clearCurrentSong())
    }
  }
}

export const addToPlaylist = song => {
  return (dispatch, getState) => {
    const {
      music: { playlist }
    } = getState()
    let copy = playlist.slice()
    if (!copy.find(({ id }) => id === song.id)) {
      copy.unshift(song)
      dispatch({ type: actionTypes.SET_PLAYLIST, payload: copy })
    }
  }
}

export const setPlaylistShow = payload => {
  return dispatch => {
    dispatch({
      type: actionTypes.SET_PLAYLIST_SHOW,
      payload
    })
  }
}

export const setPlayMode = payload => {
  return dispatch => {
    dispatch({
      type: actionTypes.SET_PLAY_MODE,
      payload
    })
  }
}

async function checkCanPlay(id) {
  const { data } = await getSongUrl(id)
  const [resultSong] = data
  return !!resultSong.url
}

export const clearPlaylist = () => {
  return dispatch => {
    dispatch({
      type: actionTypes.SET_PLAYLIST,
      payload: []
    })
    dispatch(clearCurrentSong())
  }
}

export const clearPlayHistory = () => {
  return dispatch => {
    const history = []
    dispatch({
      type: actionTypes.SET_PLAY_HISTORY,
      history
    })
  }
}
