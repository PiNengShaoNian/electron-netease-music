import React, { memo } from 'react'
import { Pagination as ElPagination } from 'element-react'

export default memo(function Pagination({ total, pageSize, onPageChange }) {
  return total > pageSize ? (
    <div style={{ textAlign: 'right' }}>
      <ElPagination
        pageSize={pageSize}
        total={total}
        layout="prev,pager,next"
        onCurrentChange={onPageChange}
      />
    </div>
  ) : null
})
