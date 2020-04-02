/*
 * @Author: zhoum
 * @Date: 2020-02-27 09:16:54
 * @LastEditTime: 2020-04-01 16:50:08
 * @LastEditors: Donkey
 * @Description:
 */
import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/course/category/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/course/category',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/course/category/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/course/category/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/course/category',
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: obj
  })
}

export function getAllCategoryType(type) {
  return request({
    url: '/course/category/getCategoryTree?type=' + type,
    method: 'get'
  })
}

export function getCategoryTree(type) {
  return request({
    url: '/course/category/getCategoryTree',
    method: 'get'
  })
}
