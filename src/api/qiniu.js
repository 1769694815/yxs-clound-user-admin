/*
 * @Author: xwen
 * @Date: 2020-01-15 14:51:45
 * @LastEditTime: 2020-02-26 09:38:03
 * @LastEditors: xwen
 * @Description: 获取qiniu token
 */
import request from '@/utils/request'

export function getToken(params) {
  console.log('params', params)
  return request({
    url: '/admin/api/upload/token',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: JSON.stringify(params)
  })
}

export function upload(params) {
  return request({
    url: '',
    method: 'post',
    data: params
  })
}
