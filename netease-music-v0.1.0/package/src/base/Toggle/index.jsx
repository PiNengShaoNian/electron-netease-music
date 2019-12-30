import React, { createRef } from 'react'
import PropTypes from 'prop-types'

import { hasParent } from '../../utils/dom'
import watchProps from '../../utils/watchProps'

export default watchProps(
  class Toggle extends React.PureComponent {
    firstChildEle = createRef()

    static propTypes = {
      show: PropTypes.bool,
      reserveDoms: PropTypes.array
    }

    static defaultProps = {
      show: true,
      reserveDoms: []
    }

    watch = {
      show(isShow) {
        setTimeout(() => {
          if (isShow) {
            this.bindClick()
          } else {
            this.removeClick()
          }
        }, 0)
      }
    }

    clickEvent = e => {
      const triggerElement = e.target
      const { reserveDoms, onChange } = this.props
      const defaultReserveDoms = Array.from(
        document.querySelectorAll('.el-loading-mask, .el-loading-spinner')
      )
      const reserves = defaultReserveDoms.concat(this.firstChildEle.current)

      if (!hasParent(triggerElement, reserves.concat(reserveDoms))) {
        onChange && onChange(false)
      }
    }

    bindClick() {
      document.addEventListener('mousedown', this.clickEvent)
    }

    removeClick() {
      document.removeEventListener('mousedown', this.clickEvent)
    }

    render() {
      return (
        <div>
          {React.cloneElement(this.props.children, { ref: this.firstChildEle })}
        </div>
      )
    }
  }
)
