import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/course/coursecomment/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/course/coursecomment',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/course/coursecomment/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/course/coursecomment/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/course/coursecomment',
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: obj
  })
}
