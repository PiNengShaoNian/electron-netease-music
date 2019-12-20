import React, { memo, useRef, useCallback, useState, useMemo } from 'react'

import Tabs from '../../base/Tabs'
import { getAllMvs } from '../../api/mv'
import MvCard from '../../components/MvCard'
import WithPagination from '../../components/WithPagination'

import './index.scss'

const areaTabs = ['全部', '内地', '港台', '欧美', '日本', '韩国']
const typeTabs = ['全部', '官方版', '原声', '现场版', '网易出品']
const sortTabs = ['上升最快', '最热', '最新']

export default memo(function Mvs() {
  const pageRef = useRef()
  const [activeAreaTabIndex, setActiveAreaTabIndex] = useState(0)
  const [activeSortTabIndex, setActiveSortTabIndex] = useState(0)
  const [activeTypeTabIndex, setActiveTypeTabIndex] = useState(0)
  const [mvCount, setMvCount] = useState(0)
  const [mvs, setMvs] = useState([])

  const getDataParams = useMemo(() => {
    return {
      area: areaTabs[activeAreaTabIndex],
      order: sortTabs[activeSortTabIndex],
      type: typeTabs[activeTypeTabIndex]
    }
  }, [activeAreaTabIndex, activeSortTabIndex, activeTypeTabIndex])

  const onAreaTabChange = useCallback(index => {
    setActiveAreaTabIndex(index)
  }, [])

  const onSortTabChange = useCallback(index => {
    setActiveSortTabIndex(index)
  }, [])

  const onTypeTabChange = useCallback(index => {
    setActiveTypeTabIndex(index)
  }, [])

  const onGetSucess = useCallback(({ data, count }) => {
    setMvs(data)
    if (count) {
      setMvCount(count)
    }
  }, [])

  return (
    <div className="mvs" ref={pageRef}>
      <div className="tabs-wrap">
        <span className="tabs-type">地区: </span>
        <Tabs
          tabs={areaTabs}
          className="tabs"
          type="split"
          onActiveTabChange={onAreaTabChange}
          active={activeAreaTabIndex}
        />
      </div>
      <div className="tabs-wrap">
        <span className="tabs-type">类型: </span>
        <Tabs
          tabs={typeTabs}
          className="tabs"
          type="split"
          onActiveTabChange={onTypeTabChange}
        />
      </div>
      <div className="tabs-wrap">
        <span className="tabs-type">排序: </span>
        <Tabs
          tabs={sortTabs}
          className="tabs"
          type="split"
          onActiveTabChange={onSortTabChange}
        />
      </div>

      <WithPagination
        getData={getAllMvs}
        getDataParams={getDataParams}
        limit={40}
        scrollTarget={pageRef && pageRef.current}
        total={mvCount}
        onGetDataSuccess={onGetSucess}
      >
        <ul className="list-wrap">
          {mvs.map(mv => (
            <li className="list-item" key={mv.id}>
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
