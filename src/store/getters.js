import { isDef } from '../utils/common'

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
