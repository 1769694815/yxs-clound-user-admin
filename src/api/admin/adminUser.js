import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/user/adminPage',
    method: 'get',
    params: query
  })
}

export function getRoleAdmin() {
  return request({
    url: '/admin/role/getRoleAdminList',
    method: 'get'
  })
}
export function addObj(obj) {
  return request({
    url: '/admin/user/adminUserSave',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'get'
  })
}

export function delObj(obj) {
  return request({
    url: '/admin/user/adminUserDelete',
    method: 'post',
    data: obj
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/user/adminUserUpdate',
    method: 'post',
    data: obj
  })
}
