import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/news/articlecategory/page',
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

