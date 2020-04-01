import request from '@/utils/request'

export function fetchList(query) {
  for (const key in query) {
    if (query[key] == null || query[key] === '') {
      delete query[key]
    }
  }
  return request({
    url: '/classroom/category/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/classroom/category',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/classroom/category/' + id,
    method: 'get'
  })
}

export function delObj(row) {
  return request({
    url: '/classroom/category/' + row,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/classroom/category',
    method: 'put',
    data: obj
  })
}

export function getAllCategoryType() {
  return request({
    url: '/classroom/category/getCategoryTree',
    method: 'get'
  })
}

export function getCategoryTree() {
  return request({
    url: '/classroom/category/getCategoryTree',
    method: 'get'
  })
}

