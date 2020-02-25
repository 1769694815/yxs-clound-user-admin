/*
 * @Date: 2020-02-12 17:39:40
 * @LastEditors  : xw
 * @Author: xw
 * @LastEditTime : 2020-02-12 18:30:20
 * @Description: 获取部门api
 */
import request from '@/utils/request'

export function fetchTree(query) {
  return request({
    url: '/admin/dept/tree',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/dept/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/dept/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/dept/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/dept/',
    method: 'put',
    data: obj
  })
}
