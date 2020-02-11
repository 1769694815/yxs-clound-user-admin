/*
 * @Date: 2020-02-03 11:05:34
 * @LastEditors  : xw
 * @Author: xw
 * @LastEditTime : 2020-02-11 14:20:18
 * @Description: 用户信息
 */
import request from '@/utils/request'
const scope = 'server'

export function login(username, password, code, randomStr) {
  const grant_type = 'password'
  return request({
    url: '/auth/oauth/token',
    headers: {
      'TENANT-ID': '1',
      'Authorization': 'Basic cGlnOnBpZw=='
    },
    method: 'post',
    params: { username, password, randomStr, code, grant_type, scope }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
