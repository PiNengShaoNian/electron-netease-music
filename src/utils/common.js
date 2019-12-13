import { Notification } from 'element-react'

export { debounce, throttle } from 'lodash-es'

export function notify(message, type) {
  const params = {
    message,
    duration: 1500
  }

  const fn = type ? Notification[type] : Notification
  return fn(params)
}

;['success', 'warning', 'info', 'error'].forEach(key => {
  notify[key] = message => {
    return notify(message, key)
  }
})

export function isDef(v) {
  return v !== undefined && v !== null
}

export function genImgUrl(url, w, h) {
  if (!h) {
    h = w
  }
  url += `?param=${w}y${h}`
  return url
}