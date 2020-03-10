import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router/index'
import { getStore } from '../utils/store'
import { serialize } from '@/utils/index'
import qs from 'qs'

// 返回其他状态吗
axios.defaults.validateStatus = function(status) {
  return status >= 200 && status <= 500 // 默认的
}
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 120000 // request timeout
})

service.defaults.headers['Content-Type'] = 'application/json'

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    const TENANT_ID = getStore({ name: 'tenantId' })
    const isToken = (config.headers || {}).isToken === false
    const token = store.getters.access_token
    if (token && !isToken) {
      config.headers['Authorization'] = 'Bearer ' + token// token
    }
    if (TENANT_ID) {
      config.headers['TENANT-ID'] = TENANT_ID // 租户ID
    }

    // headers中配置serialize为true开启序列化
    if (config.method === 'post' && config.headers.serialize) {
      config.data = serialize(config.data)
      delete config.data.serialize
    }

    if (config.method === 'get') {
      config.paramsSerializer = function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  res => res
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  res => {
    const status = Number(res.status) || 200
    const message = res.data.msg
    if (status === 401) {
      Message({
        message: message,
        type: 'error'
      })
      store.dispatch('user/fedLogOut').then(() => {
        router.push({ path: '/login' })
      })
      return
    }

    if (status !== 200 || res.data.code === 1) {
      Message({
        message: message,
        type: 'error'
      })
      return Promise.reject(new Error(message))
    }

    return res
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
