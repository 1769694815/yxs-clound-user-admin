/*
 * @Author: Donkey
 * @Date: 2020-03-12 10:59:47
 * @LastEditTime: 2020-03-23 16:28:03
 * @LastEditors: Donkey
 * @Description:
 */
import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/user/adminPage',
    method: 'get',
    params: query
  })
}

export function getRoleAdmin() {
  return request({
    url: '/admin/role/getRoleAdminList',
    method: 'get'
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
