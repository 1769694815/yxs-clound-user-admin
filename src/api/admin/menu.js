/*
 * @Date: 2020-02-11 17:07:24
 * @LastEditors  : xw
 * @Author: xw
 * @LastEditTime : 2020-02-12 13:34:10
 * @Description: 菜单api
 */
import request from '@/utils/request'

export function getMenu(id) {
  return request({
    url: '/admin/menu',
    params: { parentId: id },
    method: 'get'
  })
}
