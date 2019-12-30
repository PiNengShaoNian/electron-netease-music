import React, { memo } from 'react'
import { Loading } from 'element-react'
import ReactDom from 'react-dom'

const _Loading = memo(function({ loading }) {
  return loading ? (
    <Loading text="载入中">
      <div className="loading" style={{ height: 200 }}></div>
    </Loading>
  ) : null
})

_Loading.service = ({ target = 'body', background, text }) => {
  const container = document.querySelector(target)
  const div = document.createElement('div')
  container.appendChild(div)
  ReactDom.render(
    <Loading
      text={text}
      fullscreen
      className="fullscreen-loading"
      style={{ background: background }}
    />,
    div
  )

  return {
    close() {
      ReactDom.unmountComponentAtNode(div)
      div.remove()
    }
  }
}

export default _Loading
