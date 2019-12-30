import React, { memo, useEffect, useState } from 'react'

import Title from '../../base/Title'
import MvCard from '../../components/MvCard'
import { getPersonalizedMv } from '../../api/discovery'

import './NewMvs.scss'

export default memo(function() {
  const [mvs, setMvs] = useState([])
  useEffect(() => {
    ;(async () => {
      const { result } = await getPersonalizedMv()
      setMvs(result)
    })()
  }, [])
  return mvs.length ? (
    <div className="new-mvs">
      <Title>推荐MV</Title>
      <ul className="list-wrap">
        {mvs.map(mv => (
          <li key={mv.id} className="list-item">
            <MvCard
              author={mv.artistName}
              id={mv.id}
              img={mv.picUrl}
              name={mv.name}
              playCount={mv.playCount}
            />
          </li>
        ))}
      </ul>
    </div>
  ) : null
})
