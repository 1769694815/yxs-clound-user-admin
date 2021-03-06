/*
 * @Author: Donkey
 * @Date: 2020-03-31 16:49:27
 * @LastEditTime: 2020-04-02 11:43:52
 * @LastEditors: Donkey
 * @Description:
 */
import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/tenant/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/tenant',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/tenant/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/tenant/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/tenant',
    method: 'put',
    data: obj
  })
}

export function enableObj(id) {
  return request({
    url: '/admin/tenant/enable/' + id,
    method: 'put'
  })
}

export function disableObj(id) {
  return request({
    url: '/admin/tenant/disable/' + id,
    method: 'put'
  })
}
