import React, { memo } from 'react'

import './index.scss'

export default memo(function HighlightText({ text, highlightText }) {
  if (!highlightText) {
    return <span>{text}</span>
  }

  const titleToMatch = text.toLowerCase()
  const keyWord = highlightText.toLowerCase()
  const matchIndex = titleToMatch.indexOf(keyWord)
  const beforeStr = text.substr(0, matchIndex)
  const afterStr = text.substr(matchIndex, keyWord.length)
  const hitStr = text.substr(matchIndex, keyWord.length)

  const titleSpan =
    matchIndex > -1 ? (
      <span>
        {beforeStr} <span className="high-light-text">{hitStr}</span>
        {afterStr}
      </span>
    ) : (
      text
    )

  return <span>{titleSpan}</span>
})
