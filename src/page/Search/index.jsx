import React, {
  memo,
  useRef,
  useState,
  createContext,
  useMemo,
  useCallback
} from 'react'
import { useParams } from 'react-router-dom'

import Tabs from '../../base/Tabs'
import Empty from '../../base/Empty'
import { renderRoutes } from '../../router'

import './index.scss'

export const SearchRootContext = createContext()

const tabs = [
  {
    title: '歌曲',
    key: 'songs',
    to: 'songs'
  },
  {
    title: '歌单',
    key: 'playlists',
    to: 'playlists'
  },
  {
    title: 'MV',
    key: 'mvs',
    to: 'mvs'
  }
]

export default memo(function Search({ route }) {
  const header = useRef()
  const { keywords } = useParams()
  const [count, setCount] = useState(0)

  const onUpdateCount = useCallback(count => {
    setCount(count)
  }, [])

  const showEmpty = useMemo(() => {
    return !count === 0
  }, [count])

  const providerValue = useMemo(() => {
    return {
      header: header,
      keywords,
      onUpdateCount
    }
  }, [keywords, onUpdateCount])

  return (
    <div className="search-detail">
      <div className="header" ref={header}>
        <span className="keywords">{keywords}</span>
        <span className="found">找到{count}个结果</span>
      </div>
      <div className="tabs-wrap">
        <Tabs tabs={tabs} itemClass="search-tab-item" />
      </div>
      {showEmpty ? <Empty className="empty" /> : null}
      <SearchRootContext.Provider value={providerValue}>
        {renderRoutes(route.routes)}
      </SearchRootContext.Provider>
    </div>
  )
})
