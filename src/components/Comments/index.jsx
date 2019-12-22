import React, {
  memo,
  useMemo,
  useState,
  useRef,
  useCallback,
  useEffect
} from 'react'
import PropTypes from 'prop-types'

import Empty from '../../base/Empty'
import Loading from '../../base/Loading'
import Pagination from '../../base/Pagination'
import Comment from '../Comment'
import {
  getPlaylistComment,
  getSongComment,
  getMvComment,
  getHotComment
} from '../../api/comment'
import { getPageOffset, isLast } from '../../utils/common'
import { scrollInto } from '../../utils/dom'

import './index.scss'

const SONG_TYPE = 'song'
const PLAYLIST_TYPE = 'playlist'
const MV_TYPE = 'mv'
const PAGE_SIZE = 20

const Comments = memo(function Comments({ type, id, onUpdate }) {
  const [hotComments, setHotComments] = useState([])
  const [comments, setComments] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const commentTitle = useRef()
  const [loading, setLoading] = useState(false)

  const shouldHotCommentShow = useMemo(() => {
    return hotComments.length > 0 && currentPage === 1
  }, [currentPage, hotComments])

  const shouldCommentShow = useMemo(() => {
    return comments.length > 0
  }, [comments])

  const getComment = useCallback(async () => {
    setLoading(true)
    const commentRequestMap = {
      [PLAYLIST_TYPE]: getPlaylistComment,
      [SONG_TYPE]: getSongComment,
      [MV_TYPE]: getMvComment
    }

    const commentRequest = commentRequestMap[type]

    const { hotComments = [], comments = [], total } = await commentRequest({
      id: id,
      pageSize: PAGE_SIZE,
      offset: getPageOffset(currentPage, PAGE_SIZE)
    }).finally(() => {
      setLoading(false)
    })

    if (type === PLAYLIST_TYPE && currentPage === 1) {
      const { hotComments: exactHotComments = [] } = await getHotComment({
        id: id,
        type: 2
      })

      setHotComments(exactHotComments)
    } else {
      setHotComments(hotComments)
    }

    setComments(comments)
    setTotal(total)
    onUpdate && onUpdate({ comments, hotComments, total })
  }, [type, id, currentPage, onUpdate])

  const onPageChange = useCallback(
    async index => {
      setCurrentPage(index)
      await getComment()
      setTimeout(() => {
        scrollInto(commentTitle.current)
      })
    },
    [getComment]
  )

  useEffect(() => {
    if (id) {
      setCurrentPage(1)
      getComment()
    }
  }, [id, getComment])

  return (
    <div className="comment">
      {loading ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          {shouldHotCommentShow ? (
            <div className="block">
              <p className="title">精彩评论</p>
              {hotComments.map((comment, index) => (
                <Comment
                  border={isLast(index, hotComments)}
                  comment={comment}
                  key={index}
                />
              ))}
            </div>
          ) : null}

          {shouldCommentShow ? (
            <div className="block">
              <p className="title" ref={commentTitle}>
                最新评论
                <span className="count">{total}</span>
              </p>
              {comments.map((comment, index) => (
                <Comment
                  border={isLast(index, comment)}
                  comment={comment}
                  key={index}
                />
              ))}
            </div>
          ) : null}

          <Pagination
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={onPageChange}
          />
        </>
      )}
      {!loading && !shouldCommentShow && !shouldCommentShow ? (
        <Empty>还没有评论喔</Empty>
      ) : null}
    </div>
  )
})

Comments.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.string
}

Comments.defaultProps = {
  type: SONG_TYPE
}

export default Comments
