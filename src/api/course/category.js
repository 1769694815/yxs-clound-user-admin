/*
 * @Author: zhoum
 * @Date: 2020-02-27 09:16:54
 * @LastEditTime: 2020-03-06 15:29:07
 * @LastEditors: zhoum
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

export function getCategoryTreeByNotType(type) {
  return request({
    url: '/course/category/getCategoryTreeByNotType?type=' + type,
    method: 'get'
  })
}
