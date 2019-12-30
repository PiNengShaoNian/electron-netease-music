import React, { memo, useCallback, useState, useRef, useMemo } from 'react'
import PropTypes from 'prop-types'

import Icon from '../Icon'
import ProgressBar from '../ProgressBar'

import './index.scss'

const Volume = memo(function Volume({ volume: volumeProp, onVolumeChange }) {
  const [volume, setVolume] = useState(volumeProp)
  const lastVolume = useRef(1)

  const iconType = useMemo(() => {
    return volume ? 'horn' : 'silence'
  }, [volume])

  const onProgressChange = useCallback(
    percent => {
      if (percent < 0.05) {
        percent = 0
      }
      setVolume(percent)

      onVolumeChange && onVolumeChange(percent)
    },
    [onVolumeChange]
  )

  const toggleSilence = useCallback(() => {
    const target = volume ? 0 : lastVolume.current
    if (volume) {
      lastVolume.current = volume
    }
    onProgressChange(target)
  }, [volume, onProgressChange])

  return (
    <div className="volume">
      <Icon size={20} type={iconType} onClick={toggleSilence} />
      <div className="progress-wrap">
        <ProgressBar
          percent={volume}
          percentChange={onProgressChange}
          alwaysShowBtn
        />
      </div>
    </div>
  )
})

Volume.propTypes = {
  volume: PropTypes.number
}

Volume.defaultProps = {
  volume: 1
}

export default Volume
