import request from '@/utils/request'

export function fetchList(query) {
  for (const key in query) {
    if (query[key] == null || query[key] === '') {
      delete query[key]
    }
  }
  return request({
    url: '/orders/tenantorder/page',
    method: 'get',
    params: query
  })
}

export function createOrder(obj) {
  return request({
    url: '/orders/tenantorder',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/orders/tenantorder/' + id,
    method: 'get'
  })
}

export function delObj(row) {
  return request({
    url: '/orders/tenantorder/' + row.id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/orders/tenantorder',
    method: 'put',
    data: obj
  })
}
