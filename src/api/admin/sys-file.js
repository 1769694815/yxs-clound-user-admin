/*
 * @Date: 2020-02-15 18:09:42
 * @LastEditors  : xw
 * @Author: xw
 * @LastEditTime : 2020-02-15 18:10:08
 * @Description: 文件管理api
 */

import request from '@/utils/request'

export function fetchList (query) {
  return request({
    url: '/admin/sys-file/page',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: '/admin/sys-file',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: '/admin/sys-file/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: '/admin/sys-file/' + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: '/admin/sys-file',
    method: 'put',
    data: obj
  })
}
