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

    const { playHistory } = getState()
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
    const { playlist } = getState()
    const copy = playlist.slice()
    if (!copy.find(({ id }) => id === song.id)) {
      copy = copy.unshift(song)
      dispatch({ type: actionTypes.SET_PLAYLIST, payload: copy })
    }
  }
}

async function checkCanPlay(id) {
  const { data } = await getSongUrl(id)
  const [resultSong] = data
  return !!resultSong.url
}
