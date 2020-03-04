/*
 * @Date: 2020-02-11 17:07:24
 * @LastEditors: xwen
 * @Author: xw
 * @LastEditTime: 2020-03-02 14:25:11
 * @Description: 菜单api
 */
import request from '@/utils/request'

export function getMenu(id) {
  return request({
    url: '/admin/menu',
    params: { parentId: id },
    method: 'get'
  })
}

export function fetchMenuTree(query) {
  return request({
    url: '/admin/menu/tree',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/menu',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: JSON.stringify(obj)
  })
}

export function getObj(id) {
  return request({
    url: '/admin/menu/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/menu/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/menu',
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: JSON.stringify(obj)
  })
}
