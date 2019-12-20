import React, { memo, useCallback, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import Pagination from '../../base/Pagination'
import { scrollInto } from '../../utils/dom'
import { getPageOffset } from '../../utils/common'

const style = {
  marginTop: 16
}

const WithPagination = memo(function WithPagination({
  children,
  getData,
  getDataParams,
  onGetDataSuccess,
  onGetDataError,
  limit,
  scrollTarget,
  total
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const onPageChange = useCallback(
    async index => {
      setCurrentPage(index)
      try {
        const result = await getData({
          limit,
          offset: getPageOffset(index, limit),
          ...getDataParams
        })
        onGetDataSuccess && onGetDataSuccess(result)
        console.log('scroll into view')
        if (scrollTarget) {
          scrollInto(scrollTarget)
        }
      } catch (error) {
        onGetDataError && onGetDataError(error)
      }
    },
    [
      getDataParams,
      getData,
      limit,
      onGetDataError,
      onGetDataSuccess,
      scrollTarget
    ]
  )

  useEffect(() => {
    onPageChange(1)
  }, [getDataParams, onPageChange])

  return (
    <div className="with-pagination">
      {children}
      <div className="pagination-wrap" style={style}>
        <Pagination
          currentPage={currentPage}
          pageSize={limit}
          total={total}
          onPageChange={onPageChange}
          className="pagination"
        />
      </div>
    </div>
  )
})

WithPagination.propTypes = {
  getData: PropTypes.func,
  getDataParams: PropTypes.shape({}),
  limit: PropTypes.number,
  scrollTarget: PropTypes.shape({}),
  total: PropTypes.number
}

WithPagination.defaultTypes = {
  getDataParams: {},
  limit: 10,
  total: 0
}

export default WithPagination
