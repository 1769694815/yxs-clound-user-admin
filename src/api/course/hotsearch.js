import request from '@/utils/request'

export function fetchList(query) {
  for (const key in query) {
    if (query[key] == null || query[key] === '') {
      delete query[key]
    }
  }
  return request({
    url: '/course/hotsearch/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/course/hotsearch',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/course/hotsearch/' + id,
    method: 'get'
  })
}

export function delObj(row) {
  return request({
    url: '/course/hotsearch/' + row.id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/course/hotsearch',
    method: 'put',
    data: obj
  })
}
