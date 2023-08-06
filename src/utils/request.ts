import axios from 'axios'
import type { HeadersDefaults, AxiosRequestConfig } from 'axios'
import { message } from 'antd'

const BASE_URL = '/api'
// 添加额外的头部配置
interface Header extends HeadersDefaults {
  'Content-Type': string
  'Authorization': string
}
(axios.defaults.headers as Header)['Content-Type'] = 'application/json'

// 返回数据格式
interface Response<T> {
  status: number
  data: T
  msg: string
  success: boolean
}

const service = axios.create({
  baseURL: BASE_URL,
  timeout: 5000
})

// 请求拦截
service.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  token && (config.headers!.Authorization = 'Bearer ' + token)
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截
service.interceptors.response.use(res => {
  return res
}, error => {
  const { status } = error.response
  const { stat, message } = error.response.data
  return handleErrorCode(status, stat, message)
})
// 处理错误代码
function handleErrorCode (status: number, stat: string, msg: string) {
  switch (status) {
    case 400:
    case 401:
    case 403:
    case 404:
    case 405:
    case 500: {
      message.error(msg)
      return Promise.reject(stat)
    }
    default: {
      message.error('请求出错')
      return Promise.reject(stat)
    }
  }
}
// 请求函数
async function request<T> (option: AxiosRequestConfig) {
  try {
    const res = await service.request<Response<T>>({
      ...option
    })
    return res.data
  } catch (error) {
    return undefined
  }
}
export default request
