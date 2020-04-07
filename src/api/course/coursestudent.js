/*
 * @Author: Donkey
 * @Date: 2020-04-03 09:31:57
 * @LastEditTime: 2020-04-03 16:28:18
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
    url: '/course/coursestudent/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/course/coursestudent',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/course/coursestudent/' + id,
    method: 'get'
  })
}

export function delObj(row) {
  return request({
    url: '/course/coursestudent/' + row.id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/course/coursestudent',
    method: 'put',
    data: obj
  })
}

export function importStudent(obj) {
  return request({
    url: '/course/coursestudent/import',
    method: 'post',
    data: obj
  })
}

