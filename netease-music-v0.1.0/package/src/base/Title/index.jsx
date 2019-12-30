import React, { memo } from 'react'

import './index.scss'

export default memo(function Title({ children }) {
  return (
    <div className="title-wrap">
      <p className="title">{children}</p>
    </div>
  )
})
