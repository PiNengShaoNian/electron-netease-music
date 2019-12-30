import actionTypes from '../action/actionTypes'

const initState = {
  user: {},
  userPlaylist: []
}

export default (state = initState, action) => {
  const { type, payload } = action
  switch (type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: payload
      }
    case actionTypes.SET_USER_PLAYLIST:
      return {
        ...state,
        userPlaylist: payload
      }
    default:
      return state
  }
}
