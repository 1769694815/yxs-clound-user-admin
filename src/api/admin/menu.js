/*
 * @Date: 2020-02-11 17:07:24
 * @LastEditors  : xw
 * @Author: xw
 * @LastEditTime : 2020-02-11 17:56:26
 * @Description: 菜单api
 */
import request from '@/utils/request'

export function getMenu(id) {
  console.log('12313')
  return request({
    url: '/admin/menu',
    params: {parentId: id},
    method: 'get'
  })
}
