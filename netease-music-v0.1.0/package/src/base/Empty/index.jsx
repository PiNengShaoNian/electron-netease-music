import React, { memo } from 'react'

export default memo(function Empty({ children }) {
  return (
    <div
      className="empty"
      style={{
        textAlign: 'center',
        marginTop: 100,
        color: 'var(--font-color)'
      }}
    >
      {children ? children : '暂无内容'}
    </div>
  )
})
