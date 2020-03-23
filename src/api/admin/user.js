/*
 * @Date: 2020-02-13 15:15:03
 * @LastEditors: Donkey
 * @Author: xw
 * @LastEditTime: 2020-03-23 09:05:06
 * @Description: 用户管理api
 */
import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/user/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/user',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/user',
    method: 'put',
    data: obj
  })
}

export function updateInfo(obj) {
  return request({
    url: '/admin/user/edit',
    method: 'put',
    data: obj
  })
}
