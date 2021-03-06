/*
 * @Author: zhoum
 * @Date: 2020-02-27 09:16:54
 * @LastEditTime: 2020-03-03 17:13:30
 * @LastEditors: zhoum
 * @Description:
 */
import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/course/course/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/course/course',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/course/course/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/course/course/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/course/course',
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: obj
  })
}

export function getCategoryTree(type) {
  return request({
    url: '/course/category/getCategoryTree?type=' + type,
    method: 'get'
  })
}

export function getCourseSimpleList() {
  return request({
    url: '/course/course/getCourseSimpleList',
    method: 'get'
  })
}
