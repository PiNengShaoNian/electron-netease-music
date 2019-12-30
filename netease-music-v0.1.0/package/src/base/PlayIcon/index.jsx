import React, { memo } from 'react'
import PropTypes from 'prop-types'

import Icon from '../Icon'

import './index.scss'

const PlayIcon = memo(function PlayIcon({ size, className }) {
  const wrapStyle = {
    width: size,
    height: size
  }

  return (
    <div className={`${className} play-icon-wrap`} style={wrapStyle}>
      <Icon size={size * 0.6} className="play-icon" type="play" />
    </div>
  )
})

PlayIcon.propTypes = {
  size: PropTypes.number
}

PlayIcon.defaultTypes = {
  size: 24
}

export default PlayIcon
