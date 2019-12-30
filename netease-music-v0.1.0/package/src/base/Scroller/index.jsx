import React from 'react'
import BScroll from '@better-scroll/core'
import ScrollBar from '@better-scroll/scroll-bar'
import MouseWheel from '@better-scroll/mouse-wheel'
import PropTypes from 'prop-types'

import watchProps from '../../utils/watchProps'

import './index.scss'

const defaultOptions = {
  mouseWheel: true,
  scrollY: true,
  scrollbar: true,
  probeType: 3
}

BScroll.use(ScrollBar)
BScroll.use(MouseWheel)

export default watchProps(
  class Scroller extends React.PureComponent {
    static propTypes = {
      data: PropTypes.array,
      options: PropTypes.shape({})
    }

    static defaultProps = {
      data: [],
      options: {}
    }

    watch = {
      data() {
        queueMicrotask(() => {
          if (!this.scroller) {
            this.scroller = new BScroll(
              this.scrollerRef,
              Object.assign({}, defaultOptions, this.props.options)
            )
            this.props.onInit && this.props.onInit(this.scroller)
          } else {
            this.scroller && this.scroller.refresh()
          }
        })
      }
    }

    setScroller = scroller => {
      this.scrollerRef = scroller
    }

    getScroller = () => {
      return this.scroller
    }

    refresh = () => {
      this.scroller.refresh()
    }

    render() {
      const { className, children } = this.props
      return (
        <div className={`scroller ${className}`} ref={this.setScroller}>
          {children}
        </div>
      )
    }
  }
)
