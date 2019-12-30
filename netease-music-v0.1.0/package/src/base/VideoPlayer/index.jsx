import React, { createRef } from 'react'
import Player from 'xgplayer'

import { toRem } from '../../utils/rem'
import watchProps from '../../utils/watchProps'

export default watchProps(
  class VideoPlayer extends React.PureComponent {
    playerRef = createRef()

    watch = {
      url(url, oldUrl) {
        if (url && url !== oldUrl) {
          if (!this.player) {
            this.initPlayer()
          } else {
            this.player.src = url
            this.player.reload()
          }
        }
      }
    }

    initPlayer() {
      const { url } = this.props
      if (!url) return

      this.player = new Player({
        el: this.playerRef.current,
        url,
        videoInit: true,
        lang: 'zh-cn',
        width: '100%',
        playbackRate: [0.5, 0.75, 1, 1.5, 2]
      })
    }

    transferRem() {
      this.player.on('on', () => {
        const videoWrapper = this.playerRef.current
        const height = videoWrapper.style.height
        const remHeight = toRem(height.replace('px', '') - 0)
        videoWrapper.style.height = remHeight
      })
    }
    componentDidMount() {
      this.initPlayer()
      if (!this.player) return
      this.transferRem()
    }

    render() {
      return <div className="video-player" ref={this.playerRef} />
    }
  }
)
