import { isDef } from '../utils/common'
import { playModeMap } from '../utils/config'

const getRandomIndex = (playlist, currentIndex) => {
  // 防止无限循环
  if (playlist.length === 1) {
    return currentIndex
  }
  let index = Math.round(Math.random() * (playlist.length - 1))
  if (index === currentIndex) {
    index = getRandomIndex(playlist, currentIndex)
  }
  return index
}

export const currentIndex = ({ music }) => {
  const { currentSong, playlist } = music
  return playlist.findIndex(({ id }) => id === currentSong.id)
}

export const isLogin = ({ user }) => {
  return isDef(user.user.userId)
}

export const userMenus = ({ user: { user, userPlaylist } }) => {
  const retMenus = []
  const userCreateList = []
  const userCollectList = []

  userPlaylist.forEach(playlist => {
    const { userId } = playlist
    if (user.userId === userId) {
      userCreateList.push(playlist)
    } else {
      userCollectList.push(playlist)
    }
  })

  const genPlaylistChildren = playlist =>
    playlist.map(({ id, name }) => ({
      path: `/playlist/${id}`,
      meta: {
        title: name,
        icon: 'playlist-menu'
      }
    }))

  if (userCreateList.length) {
    retMenus.push({
      type: 'playlist',
      title: '创建的歌单',
      children: genPlaylistChildren(userCreateList)
    })
  }

  if (userCollectList.length) {
    retMenus.push({
      type: 'playlist',
      title: '收藏的歌单',
      children: genPlaylistChildren(userCollectList)
    })
  }

  return retMenus
}

export const nextSong = ({ music }) => {
  const { playlist, playMode } = music
  const _currentIndex = currentIndex({ music })
  const nextStratMap = {
    [playModeMap.sequence.code]() {
      let nextIndex = _currentIndex + 1
      if (nextIndex > playlist.length - 1) {
        nextIndex = 0
      }
      return nextIndex
    },
    [playModeMap.loop.code]() {
      return _currentIndex
    },
    [playModeMap.random.code]() {
      return getRandomIndex(playlist, _currentIndex)
    }
  }

  const getNextStrat = nextStratMap[playMode]
  const index = getNextStrat()

  return playlist[index]
}

export const prevSong = ({ music }) => {
  const { playlist, playMode } = music
  const _currentIndex = currentIndex({ music })

  const prevStratMap = {
    [playModeMap.sequence.code]() {
      let prevIndex = _currentIndex - 1
      if (prevIndex < 0) {
        prevIndex = playlist.length - 1
      }
      return prevIndex
    },
    [playModeMap.loop.code]() {
      return _currentIndex
    },
    [playModeMap.random.code]() {
      return getRandomIndex(playlist, _currentIndex)
    }
  }

  const getPrevStrat = prevStratMap[playMode]
  const index = getPrevStrat()

  return playlist[index]
}
