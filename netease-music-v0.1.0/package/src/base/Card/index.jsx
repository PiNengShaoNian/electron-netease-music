import React, { memo } from 'react'

import { genImgUrl } from '../../utils/common'

import './index.scss'

export default memo(function Card({
  onClick,
  imgWrap,
  imgMask,
  desc,
  img,
  name,
  className
}) {
  return (
    <div onClick={onClick} className={`horizontal-card ${className}`}>
      {imgWrap ? (
        imgWrap
      ) : (
        <div className="img-wrap">
          <img src={genImgUrl(img, 50)} alt="mv" />
          {imgMask}
        </div>
      )}
      <div className="content">
        <div className="name">{name}</div>
        <div className="desc">{desc}</div>
      </div>
    </div>
  )
})
