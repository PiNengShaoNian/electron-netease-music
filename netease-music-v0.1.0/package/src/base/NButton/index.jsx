import React, { memo } from 'react'
import PropTypes from 'prop-types'

import './index.scss'

const NButton = memo(function NButton({ onClick, children, className }) {
  return (
    <div className={`n-button ${className}`} onClick={onClick}>
      {children}
    </div>
  )
})

NButton.propTypes = {
  type: PropTypes.string
}

NButton.defaultProps = {
  type: 'common'
}

export default NButton