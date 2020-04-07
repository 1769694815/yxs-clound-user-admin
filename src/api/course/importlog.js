/*
 * @Author: Donkey
 * @Date: 2020-04-06 08:50:30
 * @LastEditTime: 2020-04-06 17:00:43
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
    url: '/course/importlog/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/course/importlog',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/course/importlog/' + id,
    method: 'get'
  })
}

export function delObj(row) {
  return request({
    url: '/course/importlog/' + row.id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/course/importlog',
    method: 'put',
    data: obj
  })
}

export function reGenResultFile(id) {
  return request({
    url: '/course/importlog/reGenResultFile/' + id,
    method: 'get'

  })
}
