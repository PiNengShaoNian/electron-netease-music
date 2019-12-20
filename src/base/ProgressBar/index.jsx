import React, { memo, useRef, useCallback, useEffect } from 'react'

import PropTypes from 'prop-types'
import { toCurrentRem } from '../../utils/rem'

import './index.scss'

const ProgressBar = memo(function ProgressBar({
  disabled,
  onPercentChange,
  percent,
  alwaysShowBtn
}) {
  const progressBar = useRef()
  const progressBtn = useRef()
  const progress = useRef()

  const _offset = useCallback(offsetWidth => {
    const offsetRem = toCurrentRem(offsetWidth)
    progress.current.style.width = `${offsetRem}`
    progressBtn.current.style.transform = `translate3d(${offsetRem}, 0 , 0)`
  }, [])

  const _getPercent = useCallback(() => {
    const barWidth = progressBar.current.clientWidth
    return progress.current.clientWidth / barWidth
  }, [])

  const _triggerPercent = useCallback(() => {
    onPercentChange && onPercentChange(_getPercent())
  }, [_getPercent, onPercentChange])

  const onProgressClick = useCallback(e => {
    if (!disabled) {
      const rect = progressBar.current.getBoundingClientRect()
      const offsetWidth = Math.max(
        0,
        Math.min(e.pageX - rect.left, progressBar.current.clientWidth)
      )

      _offset(offsetWidth)

      _triggerPercent()
    }
  }, [_offset, _triggerPercent, disabled])

  const setProgressOffset = useCallback(percent => {
    if (percent >= 0) {
      const barWidth = progressBar.current.clientWidth
      const offsetWidth = percent * barWidth
      _offset(offsetWidth)
    }
  }, [_offset])

  useEffect(() => {
    setProgressOffset(percent)
  }, [percent, setProgressOffset])

  return (
    <div className="progress-bar" ref={progressBar} onClick={onProgressClick}>
      <div className="bar-inner">
        <div className="progress" ref={progress} />
        <div className="progress-btn-wrapper" ref={progressBtn}>
          <div
            className={alwaysShowBtn ? 'show progress-btn' : 'progress-btn'}
          ></div>
        </div>
      </div>
    </div>
  )
})

ProgressBar.propTypes = {
  percent: PropTypes.number,
  alwaysShowBtn: PropTypes.bool,
  disabled: PropTypes.bool
}

ProgressBar.defaultProps = {
  percent: 0,
  alwaysShowBtn: false,
  disabled: false
}

export default ProgressBar
