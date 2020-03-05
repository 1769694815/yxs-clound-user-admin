import request from '@/utils/request'

export function fetchList(query) {
  for (const key in query) {
    if (query[key] == null || query[key] === '') {
      delete query[key]
    }
  }
  return request({
    url: '/news/articlecategory/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/news/articlecategory',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/news/articlecategory/' + id,
    method: 'get'
  })
}

export function delObj(row) {
  return request({
    url: '/news/articlecategory/' + row.id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/news/articlecategory',
    method: 'put',
    data: obj
  })
}

export function fetchArticleCategoryTree(query) {
  return request({
    url: '/news/articlecategory/tree',
    method: 'get',
    params: query
  })
}
