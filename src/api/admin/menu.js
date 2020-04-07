/*
 * @Date: 2020-02-11 17:07:24
 * @LastEditors: Donkey
 * @Author: xw
 * @LastEditTime: 2020-04-07 18:30:42
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
  if (obj.parentId == null) {
    obj.parentId = -1
  }
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
