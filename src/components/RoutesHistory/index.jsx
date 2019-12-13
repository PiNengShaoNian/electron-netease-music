import React, { memo } from 'react'
import { useHistory } from 'react-router-dom'

import Icon from '../../base/Icon'

const styles = {
  routesHistory: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    marginRight: 16
  }
}

export default memo(function() {
  const history = useHistory()
  const back = () => {
    history.goBack()
  }

  const forward = () => {
    history.goForward()
  }
  return (
    <div className="routes-history" style={styles.routesHistory}>
      <Icon
        className="icon"
        style={styles.icon}
        backdrop={true}
        type="back"
        onClick={back}
      />
      <Icon backdrop={true} type="forward" onClick={forward} />
    </div>
  )
})
