import React, { memo, useMemo, useCallback } from 'react'
import { Table } from 'element-react'
import { useHistory } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import PlayIcon from '../../base/PlayIcon'
import Icon from '../../base/Icon'
import HighlightText from '../../base/HighlightText'
import { pad, genImgUrl, formatTime } from '../../utils/common'
import { goMvWithCheck } from '../../utils/business'
import { startSong, setPlaylist } from '../../action/music'

import './index.scss'

const SongTable = memo(function SongTable({
  hideColumns,
  songs,
  highlightText,
  renderNameDesc,
  showHeader
}) {
  const dispatch = useDispatch()
  const history = useHistory()
  const currentSong = useSelector(
    ({ music }) => music.currentSong,
    shallowEqual
  )

  const bindedActions = useMemo(() => {
    return bindActionCreators(
      {
        startSong,
        setPlaylist
      },
      dispatch
    )
  }, [dispatch])

  const commonHighlight = useCallback(
    (row, column) => {
      const text = row[column['property']]
      return (
        <HighlightText
          className="song-table-name"
          text={text}
          highlightText={highlightText}
        />
      )
    },
    [highlightText]
  )
  const isActiveSong = useCallback(
    song => {
      return song.id === currentSong.id
    },
    [currentSong]
  )

  const onRowClick = useCallback(
    song => {
      bindedActions.startSong(song)
      bindedActions.setPlaylist(songs)
    },
    [bindedActions, songs]
  )
  const columns = useMemo(() => {
    return [
      {
        prop: 'index',
        label: '',
        width: 70,
        render(row, _, index) {
          return (
            <div className="index-wrap">
              {isActiveSong(row) ? (
                <Icon className="horn" type="horn" color="theme" />
              ) : (
                <span>{pad(index + 1)}</span>
              )}
            </div>
          )
        }
      },
      {
        prop: 'img',
        label: ' ',
        width: 100,
        render(row) {
          return (
            <div className="img-wrap">
              <img src={genImgUrl(row.img, 120)} alt="song-table-item" />
              <PlayIcon className="play-icon" />
            </div>
          )
        }
      },
      {
        prop: 'name',
        label: '音乐标题',
        className: 'title-td',
        render(row, column, index) {
          const { mvId } = row
          
          const onGoMv = async e => {
            e.stopPropagation()
            goMvWithCheck(mvId, history)
          }

          return (
            <div>
              <div className="song-table-name-cell">
                {commonHighlight(row, column)}
                {mvId ? (
                  <Icon
                    className="mv-icon"
                    onClick={onGoMv}
                    type="mv"
                    color="theme"
                    size={18}
                  />
                ) : null}
              </div>
              {renderNameDesc ? renderNameDesc({ row, column, index }) : null}
            </div>
          )
        }
      },
      {
        prop: 'artistsText',
        label: '歌手',
        render(row, column) {
          return commonHighlight(row, column)
        }
      },
      {
        prop: 'albumName',
        label: '专辑',
        render(row, column) {
          return commonHighlight(row, column)
        }
      },
      {
        prop: 'durationSecond',
        label: '时长',
        width: 100,
        render(row) {
          return <span>{formatTime(row.durationSecond)}</span>
        }
      }
    ]
  }, [isActiveSong, history, commonHighlight, renderNameDesc])

  const showColumns = useMemo(() => {
    const hideColumnsCopy = hideColumns.slice()
    const reference = songs[0]
    const { img } = reference || {}
    if (!img) {
      hideColumnsCopy.push('img')
    }
    return columns.filter(column => {
      return !hideColumnsCopy.find(hideColumn => hideColumn === column.prop)
    })
  }, [songs, columns, hideColumns])

  return (
    <Table
      columns={showColumns}
      data={songs}
      onRowClick={onRowClick}
      style={{ width: '99.9%' }}
      className="song-table"
      showHeader={showHeader}
    />
  )
})

SongTable.propTypes = {
  hideColumns: PropTypes.array,
  songs: PropTypes.array,
  highlightText: PropTypes.string,
  renderNameDesc: PropTypes.func
}

SongTable.defaultProps = {
  hideColumns: [],
  songs: [],
  highlightText: '',
  showHeader: false
}

export default SongTable
