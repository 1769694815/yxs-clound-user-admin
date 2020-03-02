import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/question/questiontype/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/question/questiontype',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/question/questiontype/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/question/questiontype/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/question/questiontype',
    method: 'put',
    data: obj
  })
}
