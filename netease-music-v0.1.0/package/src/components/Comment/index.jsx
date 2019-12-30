import React, { memo } from 'react'

import Icon from '../../base/Icon'
import { formatDate, genImgUrl } from '../../utils/common'

import './index.scss'

export default memo(function Comment({ comment, border }) {
  return comment ? (
    <div className="one-comment">
      <div className="avatar">
        <img
          src={genImgUrl(comment.user.avatarUrl, 80)}
          alt="avatar"
          className="src"
        />
      </div>
      <div className={border ? 'border content' : 'content'}>
        <p className="comment-text">
          <span className="username">{comment.user.nickname}</span>
          <span className="text">{comment.content}</span>
        </p>

        {comment.beReplied.lenght ? (
          <div className="replied">
            <p className="comment-text">
              <span className="user">{comment.beReplied[0].user.nickname}</span>
              <span className="text">{comment.beReplied[0].content}</span>
            </p>
          </div>
        ) : null}
        <div className="bottom">
          <span className="date">{formatDate(comment.time)}</span>
          <div className="actions">
            <Icon size={12} type="good" />
            {comment.likedCount}
          </div>
        </div>
      </div>
    </div>
  ) : null
})
