import React, { memo, useEffect, useState } from 'react'
import { Carousel } from 'element-react'

import { getBanner } from '../../api/discovery'
import { genImgUrl } from '../../utils/common'

import './Banner.scss'

export default memo(function() {
  const [banners, setBanners] = useState([])
  useEffect(() => {
    ;(async () => {
      const { banners } = await getBanner()
      setBanners(banners)
    })()
  }, [])
  return (
    <Carousel interval={4000} className="banner-carousel" type="card">
      {banners.map(banner => (
        <Carousel.Item key={banner.scm}>
          <img
            src={genImgUrl(banner.imageUrl, 1000, 400)}
            alt=""
            className="banner-img"
          />
        </Carousel.Item>
      ))}
    </Carousel>
  )
})
