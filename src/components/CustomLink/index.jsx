import React, { memo, useCallback } from 'react'
import { useRouteMatch, useHistory } from 'react-router-dom'

export default memo(function CustomLink({
  exact,
  className,
  activeClass,
  to,
  children,
  replace,
  ...other
}) {
  const history = useHistory()
  const match = useRouteMatch({
    path: to
  })

  if (!other.tag) {
    other.tag = 'a'
  }

  const handleLinkClick = useCallback(() => {
    if (replace) {
      history.replace(to)
    } else {
      history.push(to)
    }
  }, [to, replace, history])

  return (
    <other.tag
      onClick={handleLinkClick}
      className={`${className} ${match ? activeClass : ''}`}
    >
      {children}
    </other.tag>
  )
})
