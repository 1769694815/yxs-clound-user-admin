/*
 * @Author: xwen
 * @Date: 2020-01-15 14:51:45
 * @LastEditTime : 2020-01-17 09:39:32
 * @LastEditors  : xwen
 * @Description: 获取qiniu token
 */
import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/profile/GetQiNiuUploadToken', // 假地址 自行替换
    method: 'get'
  })
}

export function upload(params) {
  return request({
    url: '',
    method: 'post',
    data: params
  })
}
