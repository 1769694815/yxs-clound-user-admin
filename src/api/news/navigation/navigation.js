import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/news/navigation/page',
    method: 'get',
    params: query
  })
}

export function delObj(id) {
  return request({
    url: '/news/sys-file/' + id,
    method: 'delete'
  })
}

export function dictType() {
  return request({
    url: '/admin/dict/type/navigation_type',
    method: 'get'
  })
}
