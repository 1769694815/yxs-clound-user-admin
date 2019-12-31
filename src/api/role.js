/*
 * @Author: xwen
 * @Date: 2019-12-30 16:37:52
 * @LastEditTime : 2019-12-30 17:18:51
 * @LastEditors  : xwen
 * @Description: 动态路由api、角色增删改查api
 */
import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/route/list',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/role/${id}`,
    method: 'delete'
  })
}
