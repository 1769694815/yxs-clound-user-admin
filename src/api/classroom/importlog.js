/*
 * @Author: Donkey
 * @Date: 2020-04-08 09:55:49
 * @LastEditTime: 2020-04-08 11:04:10
 * @LastEditors: Donkey
 * @Description:
 */
import request from '@/utils/request'

export function fetchList(query) {
  for (const key in query) {
    if (query[key] == null || query[key] === '') {
      delete query[key]
    }
  }
  return request({
    url: '/classroom/importlog/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/classroom/importlog',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/classroom/importlog/' + id,
    method: 'get'
  })
}

export function delObj(row) {
  return request({
    url: '/classroom/importlog/' + row.id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/classroom/importlog',
    method: 'put',
    data: obj
  })
}

export function reGenResultFile(id) {
  return request({
    url: '/classroom/importlog/reGenResultFile/' + id,
    method: 'get'

  })
}
