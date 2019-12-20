import React, { memo } from 'react'

import { genImgUrl } from '../../utils/common'

import './index.scss'

export default memo(function Card({
  onClick,
  imgWrap,
  imgMask,
  descWrap,
  desc,
  img,
  name,
  className
}) {
  return (
    <div onClick={onClick} className={`horizontal-card ${className}`}>
      {imgWrap
        ? React.cloneElement(imgWrap, {
            children: (
              <div className="img-wrap">
                <img src={genImgUrl(img, 50)} alt="mv" />
                {imgMask}
              </div>
            )
          })
        : null}
      <div className="content">
        <div className="name">{name}</div>
        <div className="desc">
          {descWrap ? React.cloneElement(descWrap, { children: desc }) : null}
        </div>
      </div>
    </div>
  )
})
