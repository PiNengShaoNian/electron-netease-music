import React, {
  memo,
  useCallback,
  useState,
  useMemo,
  useEffect,
  useRef
} from 'react'
import ReactDom from 'react-dom'
import { Input } from 'element-react'
import { bindActionCreators } from 'redux'
import { useDispatch } from 'react-redux'
import storage from 'good-storage'
import { useHistory } from 'react-router-dom'
import classnames from 'classnames'

import Toggle from '../../base/Toggle'
import NButton from '../../base/NButton'
import Icon from '../../base/Icon'
import HighlightText from '../../base/HighlightText'
import { debounce } from '../../utils/common'
import { createSong, genArtistsText } from '../../utils/business'
import { getSearchHot, getSearchSuggest } from '../../api/search'
import * as actions from '../../action/music'

import './index.scss'
const SEARCH_HISTORY_KEY = '__search_history__'

export default memo(function Search() {
  const [searchPanelShow, setSearchPanelShow] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [suggest, setSuggest] = useState({})
  const [searchHots, setSearchHots] = useState([])
  const [searchHistorys, setSearchHistorys] = useState(() => {
    return storage.get(SEARCH_HISTORY_KEY, [])
  })
  const inputRef = useRef()
  const dispatch = useDispatch()
  const history = useHistory()
  const onChange = useCallback(value => {
    setSearchKeyword(value)
  }, [])
  const onFocus = useCallback(() => {
    setSearchPanelShow(true)
  }, [])

  const bindedActions = useMemo(() => {
    return bindActionCreators(actions, dispatch)
  }, [dispatch])

  const suggestShow = useMemo(() => {
    return (
      searchKeyword.length &&
      ['songs', 'playlists'].find(key => {
        return suggest[key] && suggest[key].length
      })
    )
  }, [suggest, searchKeyword])

  const onClickSong = useCallback(
    item => {
      const {
        id,
        name,
        artists,
        duration,
        mvid,
        album: { id: albumId, name: albumName }
      } = item
      const song = createSong({
        id,
        name,
        artists,
        duration,
        albumId,
        albumName,
        mvId: mvid
      })

      bindedActions.startSong(song)
      bindedActions.addToPlaylist(song)
    },
    [bindedActions]
  )

  const normalizedSuggests = useMemo(() => {
    return [
      {
        title: '单曲',
        icon: 'music',
        data: suggest.songs,
        renderName(song) {
          return `${song.name} - ${genArtistsText(song.artists)}`
        },
        onClick(item) {
          onClickSong(item)
        }
      }
    ]
  }, [suggest, onClickSong])

  const onKeywordChange = useCallback(
    debounce(value => {
      if (!value.trim()) return
      getSearchSuggest(value).then(({ result }) => {
        setSuggest(result)
      })
    }, 500),
    []
  )

  const goSearch = useCallback(
    keywords => {
      if (!keywords) return

      setSearchHistorys([...searchHistorys, { first: keywords }])

      setSearchPanelShow(false)
      history.push(`/search/${keywords}/songs`)
    },
    [history, searchHistorys]
  )

  const onClickHot = useCallback(
    hot => {
      const { first } = hot
      goSearch(first)
    },
    [goSearch]
  )

  const onKeyDown = useCallback(
    ({ keyCode }) => {
      if (keyCode !== 13) return
      goSearch(searchKeyword)
    },
    [searchKeyword, goSearch]
  )

  const handleToggleChange = useCallback(v => {
    setSearchPanelShow(v)
  }, [])

  useEffect(() => {
    onKeywordChange(searchKeyword)
  }, [onKeywordChange, searchKeyword])

  useEffect(() => {
    ;(async () => {
      const {
        result: { hots }
      } = await getSearchHot()
      setSearchHots(hots)
    })()
  }, [])

  return (
    <div className="search">
      <Input
        icon="search"
        onChange={onChange}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        placeholder="搜索"
        ref={inputRef}
      />
      <Toggle
        onChange={handleToggleChange}
        reserveDoms={[
          inputRef.current && ReactDom.findDOMNode(inputRef.current)
        ]}
        show={searchPanelShow}
      >
        <div className={classnames('search-panel', { hide: !searchPanelShow })}>
          {suggestShow ? (
            <div className="search-suggest">
              {normalizedSuggests.map((normalizedSuggest, index) => (
                <div className="suggest-item" key={index}>
                  <div className="title">
                    <Icon size={12} type={normalizedSuggest.icon} />
                    {normalizedSuggest.title}
                  </div>
                  <ul className="list">
                    {normalizedSuggest.data.map(item => (
                      <li
                        className="item"
                        key={item.id}
                        onClick={() => normalizedSuggest.onClick(item)}
                      >
                        <HighlightText
                          highlightText={searchKeyword}
                          text={
                            normalizedSuggest.renderName
                              ? normalizedSuggest.renderName(item)
                              : item.name
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="search-hots">
              <div className="block">
                <p className="title">热门搜索</p>
                <div className="tags">
                  {searchHots.map((hot, index) => (
                    <NButton
                      key={index}
                      onClick={() => onClickHot(hot)}
                      className="button"
                    >
                      {hot.first}
                    </NButton>
                  ))}
                </div>
              </div>
              <div className="block">
                <p className="title">热门搜索</p>
                {searchHistorys.length ? (
                  <div className="tags">
                    {searchHistorys.map((history, index) => (
                      <NButton
                        key={index}
                        onClick={() => onClickHot(history)}
                        className="button"
                      >
                        {history.first}
                      </NButton>
                    ))}{' '}
                  </div>
                ) : null}
                {!searchHistorys.length && (
                  <div className="empty">暂无搜索历史</div>
                )}
              </div>
            </div>
          )}
        </div>
      </Toggle>
    </div>
  )
})
