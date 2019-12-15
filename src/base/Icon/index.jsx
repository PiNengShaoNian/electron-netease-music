import React, { memo, useCallback } from 'react'
import PropTypes from 'prop-types'

import {toRem} from '../../utils/rem'

import './index.scss'

const Icon = memo(function Icon({ size, type, color, backdrop, onClick, className }) {
  const getIconCls = useCallback(() => {
    let cls = `icon-${type}`
    if (color) {
      cls += ` icon-color-${color}`
    }
    return cls
  }, [type, color])

  const handleClick = useCallback(
    e => {
      onClick && onClick(e)
    },
    [onClick]
  )

  const getIconStyle = useCallback(() => {
    const chromeMinSize = 12
    const retStyle = { fontSize: toRem(size) }
    if (size < chromeMinSize) {
      const ratio = size / chromeMinSize
      retStyle.transform = `scale(${ratio})`
    }
    return retStyle
  }, [size])

  const Icon = (
    <i
      onClick={handleClick}
      className={`iconfont icon-component ${getIconCls()} ${className}`}
      style={getIconStyle()}
    />
  )

  if (backdrop) {
    const backDropSizeRatio = 1.56
    const backDropSize = toRem(backDropSizeRatio * size)
    return (
      <span
        style={{ width: backDropSize, height: backDropSize }}
        className="backdrop"
      >
        {Icon}
      </span>
    )
  }

  return Icon
})

Icon.propTypes = {
  size: PropTypes.number,
  type: PropTypes.string.isRequired,
  color: PropTypes.string,
  backdrop: PropTypes.bool
}

Icon.defaultProps = {
  size: 16,
  color: '',
  backdrop: false
}

export default Icon