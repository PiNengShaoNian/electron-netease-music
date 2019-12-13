import React, { memo, useCallback, useEffect, useState } from 'react'
import { Popover } from 'element-react'
import storage from 'good-storage'

import Icon from '../../base/Icon'

import variables from '../../style/themes/variables'
import variablesRed from '../../style/themes/variables-red'
import variablesWhite from '../../style/themes/variables-white'

import './index.scss'

const THEME_KEY = '__theme__'
const themes = {
  white: 'white',
  dark: 'dark',
  red: 'red'
}
const themeMap = {
  [themes.dark]: {
    title: '深色',
    file: variables,
    style: {
      backgroundColor: '#202020'
    }
  },
  [themes.white]: {
    title: '浅色',
    file: variablesWhite,
    style: {
      backgroundColor: '#f6f6f6',
      border: '1px solid #ebeaea'
    }
  },
  [themes.red]: {
    title: '红色',
    file: variablesRed,
    style: {
      backgroundColor: '#d33a31'
    }
  }
}

export default memo(function Theme() {
  const [visible, setVisible] = useState(false)
  const changeTheme = useCallback(themeKey => {
    storage.set(THEME_KEY, themeKey)
    const theme = themeMap[themeKey].file
    Object.keys(theme).forEach(key => {
      const value = theme[key]
      document.documentElement.style.setProperty(key, value)
    })
  }, [])

  useEffect(() => {
    changeTheme(storage.get(THEME_KEY, themes.white))
  }, [changeTheme])

  return (
    <div className="theme">
      <Popover
        placement="top-end"
        width="230"
        visible={true}
        content={
          <div className="themes">
            {Object.entries(themeMap).map(([key, value], index) => (
              <div
                className="theme-item"
                onClick={() => changeTheme(key)}
                key={index}
              >
                <div className="theme-icon" style={value.style} />
                <p>{value.title}</p>
              </div>
            ))}
          </div>
        }
      >
        <div>
          <Icon backdrop={true} type="skin" />
        </div>
      </Popover>
    </div>
  )
})
