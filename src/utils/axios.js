import axios from 'axios'
// import { Loading } from 'element-react'
import Confirm from '../base/Confirm'

const BASE_URL = 'http://localhost:10086'

const createBaseInstance = () => {
  const instance = axios.create({
    baseURL: BASE_URL
  })

  instance.interceptors.response.use(handleResponse, handleError)

  return instance
}

const handleResponse = response => {
  return response.data
}

const handleError = e => {
  console.log(e)
  Confirm.confirm({ text: e.message, title: '出错了~' })
}

let loadingCount = 0
let loading
const mixinLoading = interceptors => {
  const loadingRequest = config => {
    if (!loading) {
      // loading = Loading.service({
      //   target: 'body',
      //   background: 'transparent',
      //   text: '载入中'
      // })
    }

    loadingCount++
    return config
  }
  const handleResponseLoading = () => {
    loadingCount--
    if (loadingCount === 0) {
      // loading.close()
      loading = null
    }
  }
  const loadingResponse = response => {
    handleResponseLoading()
    return response
  }
  const loadingResponseError = e => {
    handleResponseLoading()
    throw e
  }
  interceptors.request.use(loadingRequest)
  interceptors.response.use(loadingResponse, loadingResponseError)
}

export const requestWithoutLoading = createBaseInstance()
export const request = createBaseInstance()
mixinLoading(request.interceptors)
