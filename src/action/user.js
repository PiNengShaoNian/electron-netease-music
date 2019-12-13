import storage from 'good-storage'

import actionTypes from './actionTypes'
import { UID_KEY } from '../utils/config'
import { notify, isDef } from '../utils/common'
import { getUserDetail, getUserPlaylist } from '../api/user'

export const login = uid => {
  return async dispatch => {
    const error = () => {
      notify.error('登录失败, 请输入正确的uid')
      return false
    }

    if (!isDef(uid)) {
      return error()
    }

    try {
      const user = await getUserDetail(uid)
      const { profile } = user
      storage.set(UID_KEY, profile.userId)
      dispatch({
        type: actionTypes.SET_USER,
        payload: profile
      })
    } catch (e) {
      return error()
    }

    const { playlist } = await getUserPlaylist(uid)
    dispatch({type: actionTypes.SET_USER_PLAYLIST,payload:  playlist})
    return true
  }
}

export const logout = () => {
  return dispatch => {
    dispatch({ type: actionTypes.SET_USER, payload: {} })
    dispatch({ type: actionTypes.SET_USER_PLAYLIST, payload: [] })
    storage.set(UID_KEY, null)
  }
}
