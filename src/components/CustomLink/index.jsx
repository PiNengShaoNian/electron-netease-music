import React, { memo } from 'react'
import { useRouteMatch } from 'react-router-dom'

export default memo(function CustomLink({
  exact,
  className,
  activeClass,
  to,
  children,
  ...other
}) {
  const match = useRouteMatch({
    to
  })

  if (!other.tag) {
    other.tag = 'a'
  }

  return (
    <other.tag className={`${className} ${match ? activeClass : ''}`}>
      {children}
    </other.tag>
  )
})
