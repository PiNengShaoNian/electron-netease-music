import React, { memo, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useHistory } from 'react-router-dom'

import CustomLink from '../../components/CustomLink'
import { isDef } from '../../utils/common'

import './index.scss'

const ROUTE_ACTIVE_CLS = 'active'
const ACTIVE_PROP = 'active'
const Tabs = memo(function Tabs({
  tabs,
  align,
  itemStyle,
  activeItemStyle,
  itemClass,
  activeItemClass,
  type,
  onActiveTabChange,
  ...other
}) {
  const { pathname } = useLocation()
  const history = useHistory()
  const isRouteMode = useMemo(() => {
    return tabs.length && isDef(tabs[0].to)
  }, [tabs])
  const normalizeTabs = useMemo(() => {
    return typeof tabs[0] === 'string'
      ? tabs.map(tab => ({ title: tab }))
      : tabs
  }, [tabs])

  const isActive = useCallback(
    (tab, index) => {
      if (isRouteMode) {
        return tab.to === pathname
      } else {
        return index === other[ACTIVE_PROP]
      }
    },
    [isRouteMode, other, pathname]
  )

  const getItemStyle = useCallback((tab, index) => {
    return Object.assign(
      {},
      itemStyle,
      isActive(tab, index) ? Object.assign({}, activeItemStyle) : null
    )
  }, [itemStyle, activeItemStyle, isActive])

  const getItemCls = useCallback(
    (tab, index) => {
      let base = []
      if (itemClass) {
        base.push(itemClass)
      }
      if (type) {
        base.push(type)
      }
      if (isActive(tab, index)) {
        if (activeItemClass) {
          base.push(activeItemClass)
        }
        base.push('active')
      }
      return base.join(' ')
    },
    [itemClass, activeItemClass, isActive, type]
  )

  const onChangeTab = useCallback(
    (tab, index) => {
      if (isRouteMode) {
        history.push(tab.to)
      } else {
        onActiveTabChange(index)
      }
    },
    [onActiveTabChange, history, isRouteMode]
  )
  return (
    <ul className={`${align ? 'align' : ''} tab-wrap`}>
      {isRouteMode ? (
        <>
          {normalizeTabs.map((tab, index) => (
            <CustomLink
              activeClass={`${ROUTE_ACTIVE_CLS} ${activeItemClass}`}
              key={index}
              style={getItemStyle(tab, index)}
              to={tab.to}
              className="tab-item"
              tag="li"
            >
              <span className="title">{tab.title}</span>
            </CustomLink>
          ))}
        </>
      ) : (
        <>
          {normalizeTabs.map((tab, index) => (
            <li
              className={`${getItemCls(tab, index)} tab-item`}
              key={index}
              style={getItemStyle(tab, index)}
              onClick={() => onChangeTab(tab, index)}
            >
              <span className="title">{tab.title}</span>
            </li>
          ))}
        </>
      )}
    </ul>
  )
})

Tabs.propTypes = {
  [ACTIVE_PROP]: PropTypes.number,
  tabs: PropTypes.array,
  align: PropTypes.string,
  itemStyle: PropTypes.shape({}),
  activeItemStyle: PropTypes.shape({}),
  itemClass: PropTypes.string,
  activeItemClass: PropTypes.string,
  type: PropTypes.string
}

Tabs.defaultProps = {
  [ACTIVE_PROP]: 0,
  tabs: [],
  align: 'left',
  itemStyle: {},
  activeItemStyle: {}
}

export default Tabs
