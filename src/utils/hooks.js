import { useEffect, useRef } from 'react'

export const useCancelRequest = () => {
  const cancelRequest = useRef(false)

  useEffect(() => {
    return () => {
      cancelRequest.current = true
    }
  }, [])

  return cancelRequest
}

export const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}
