import React, { memo } from 'react'
import { Loading } from 'element-react'

export default memo(function({ loading }) {
  return loading ? (
    <Loading text="载入中">
      <div className="loading" style={{ height: 200 }}></div>
    </Loading>
  ) : null
})
