import request from '@/utils/request'

export function fetchList(query) {
  for (const key in query) {
    if (query[key] == null || query[key] === '') {
      delete query[key]
    }
  }
  return request({
    url: '/orders/balancegrade/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/orders/balancegrade',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/orders/balancegrade/' + id,
    method: 'get'
  })
}

export function delObj(row) {
  return request({
    url: '/orders/balancegrade/' + row.id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/orders/balancegrade',
    method: 'put',
    data: obj
  })
}
