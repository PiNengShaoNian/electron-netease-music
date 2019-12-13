import React, { memo } from 'react'
import PropTypes from 'prop-types'

// import { hasParent } from '../../utils'

const Toggle = memo(function Toggle({ children }) {
  return <div>{children}</div>
})

Toggle.propTypes = {
  show: PropTypes.bool,
  reverseDoms: PropTypes.array
}

Toggle.defaultProps = {
  show: true,
  reverseDoms: []
}

export default Toggle
