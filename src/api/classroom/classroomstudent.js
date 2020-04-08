/*
 * @Author: Donkey
 * @Date: 2020-04-08 09:01:09
 * @LastEditTime: 2020-04-08 10:59:51
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
    url: '/classroom/classroomstudent/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/classroom/classroomstudent',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/classroom/classroomstudent/' + id,
    method: 'get'
  })
}

export function delObj(row) {
  return request({
    url: '/classroom/classroomstudent/' + row.id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/classroom/classroomstudent',
    method: 'put',
    data: obj
  })
}

export function importStudent(obj) {
  return request({
    url: '/classroom/classroomstudent/import',
    method: 'post',
    data: obj
  })
}
