/*
 * @Date: 2020-02-14 13:33:11
 * @LastEditors: Donkey
 * @Author: xw
 * @LastEditTime: 2020-03-12 13:43:30
 * @Description: 字典api
 */
import request from '@/utils/request'

export function fetchList(query) {
  for (const key in query) {
    if (query[key] == null || query[key] === '') {
      delete query[key]
    }
  }
  return request({
    url: '/admin/dict/page',
    method: 'get',
    params: query
  })
}

export function fetchItemList(query) {
  return request({
    url: '/admin/dict/item/page',
    method: 'get',
    params: query
  })
}

export function addItemObj(obj) {
  return request({
    url: '/admin/dict/item',
    method: 'post',
    data: obj
  })
}

export function getItemObj(id) {
  return request({
    url: '/admin/dict/item/' + id,
    method: 'get'
  })
}

export function delItemObj(row) {
  return request({
    url: '/admin/dict/item/' + row.id,
    method: 'delete'
  })
}

export function putItemObj(obj) {
  return request({
    url: '/admin/dict/item',
    method: 'put',
    data: obj
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/dict/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/dict/' + id,
    method: 'get'
  })
}

export function delObj(row) {
  return request({
    url: '/admin/dict/' + row.id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/dict/',
    method: 'put',
    data: obj
  })
}

export function remote(type) {
  return request({
    url: '/admin/dict/type/' + type,
    method: 'get'
  })
}

export function http(url, query) {
  return request({
    url,
    method: 'get',
    params: query
  })
}
export function refresh() {
  return request({
    url: '/admin/dict/refresh',
    method: 'put',
    data: {}
  })
}
