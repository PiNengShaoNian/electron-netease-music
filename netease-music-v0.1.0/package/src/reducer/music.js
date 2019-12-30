import actionTypes from '../action/actionTypes'
import storage from 'good-storage'
import { PLAY_HISTORY_KEY, playModeMap } from '../utils/config'

const initState = {
  isPlayerShow: false,
  currentSong: {},
  playing: false,
  playHistory: storage.get(PLAY_HISTORY_KEY, []),
  playlist: [],
  isMenuShow: true,
  playMode: playModeMap.sequence.code,
  isPlaylistPromptShow: false,
  isPlaylistShow: false,
  currentTime: 0
}

export default (state = initState, action) => {
  const { type, payload } = action

  switch (type) {
    case actionTypes.SET_PLAYER_SHOW:
      return {
        ...state,
        isPlayerShow: payload
      }
    case actionTypes.SET_CURRENT_SONG:
      return {
        ...state,
        currentSong: payload
      }
    case actionTypes.SET_PLAYING_STATE:
      return {
        ...state,
        playing: payload
      }
    case actionTypes.SET_PLAY_HISTORY:
      return {
        ...state,
        playHistory: payload
      }
    case actionTypes.SET_PLAYLIST:
      return {
        ...state,
        playlist: payload
      }
    case actionTypes.SET_PLAY_MODE:
      return {
        ...state,
        playMode: payload
      }
    case actionTypes.SET_CURRENT_TIME:
      return {
        ...state,
        currentTime: payload
      }
    case actionTypes.SET_PLAYLIST_SHOW:
      return {
        ...state,
        isPlaylistShow: payload
      }
    default:
  }

  return state
}
