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
    data: obj
  })
}

export function getAllCategoryType(type) {
  return request({
    url: '/course/category/getCategoryTree?type=' + type,
    method: 'get'
  })
}
