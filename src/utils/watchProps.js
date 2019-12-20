import React from 'react'
import { shallowEqual } from 'react-redux'

const getParams = (state, props = {}) => {
  const watch = state.__watchObject
  if (watch && typeof watch === 'object') {
    const params = {}
    Object.keys(watch).forEach(key => {
      params[key] = props[key]
    })

    return params
  }
}

export default function watchProps(WrappedComponent) {
  class WatchComponent extends React.PureComponent {
    state = {}

    static getDerivedStateFromProps(nextProps, prevState) {
      const params = getParams(prevState, nextProps)
      const __watchObject = prevState.__watchObject
      if (!params || !__watchObject) return null

      if (!prevState.__watchState) {
        return {
          __watchState: params
        }
      } else if (!shallowEqual(params, prevState.__watchState)) {
        return {
          __watchState: params
        }
      }
      return null
    }

    componentDidMount() {
      const watch = this.child.watch
      if (watch) {
        if (typeof watch === 'function') {
          this.setState({
            __watchObject: watch.call(this.child)
          })
        } else if (typeof watch === 'object') {
          this.setState({
            __watchObject: watch
          })
        }
      }
    }

    componentDidUpdate(prevProps) {
      console.log(prevProps)
      const params = this.state.__watchState
      const watchObject = this.state.__watchObject
      if (!watchObject || !params) return
      Object.keys(watchObject).forEach(key => {
        if (params[key] !== prevProps[key]) {
          if (watchObject[key] && typeof watchObject[key] === 'function') {
            watchObject[key].call(this.child, params[key], prevProps[key])
          }
        }
      })
    }

    getInstance() {
      return this.child
    }

    render() {
      return (
        <WrappedComponent ref={child => (this.child = child)} {...this.props} />
      )
    }
  }

  return WatchComponent
}
