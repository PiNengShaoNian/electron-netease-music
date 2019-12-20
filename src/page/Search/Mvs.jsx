import React, { memo, useMemo, useContext, useCallback, useState } from 'react'

import WithPagination from '../../components/WithPagination'
import { getSearch } from '../../api/search'
import MvCard from '../../components/MvCard'
import { SearchRootContext } from './index'

import './Mvs.scss'

const SEARCH_TYPE_MV = 1004

export default memo(function SearchMvs() {
  const searchRoot = useContext(SearchRootContext)
  const [mvs, setMvs] = useState([])
  const [mvCount, setMvCount] = useState(0)
  const searchParams = useMemo(() => {
    return { keywords: searchRoot.keywords, type: SEARCH_TYPE_MV }
  }, [searchRoot])

  const onGetMvs = useCallback(
    ({ result: { mvs, mvCount } }) => {
      setMvs(mvs)
      setMvCount(mvCount)
      searchRoot.onUpdateCount(mvCount)
    },
    [searchRoot]
  )

  return (
    <div className="search-mvs">
      <WithPagination
        getData={getSearch}
        getDataParams={searchParams}
        limit={40}
        scrollTarget={searchRoot.header && searchRoot.header.current}
        total={mvCount}
        onGetDataSuccess={onGetMvs}
      >
        <ul className="list-wrap">
          {mvs.map(mv => (
            <li key={mv.id} className="list-item">
              <MvCard
                author={mv.artistName}
                duration={mv.duration}
                id={mv.id}
                img={mv.cover}
                name={mv.name}
                playCount={mv.playCount}
              />
            </li>
          ))}
        </ul>
      </WithPagination>
    </div>
  )
})
