import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/news/navigation/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/news/navigation',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/news/navigation/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/news/navigation/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/news/navigation',
    method: 'put',
    data: obj
  })
}
export function dictType() {
  return request({
    url: '/admin/dict/type/navigation_type',
    method: 'get'
  })
}
