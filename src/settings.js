/*
 * @Author: xwen
 * @Date: 2019-12-28 13:58:38
 * @LastEditTime : 2020-02-11 17:39:00
 * @LastEditors  : xw
 * @Description: 网址信息配置
 */
module.exports = {

  title: '益小书APP管理平台',
  key: 'yxs', // 配置主键,目前用于存储
  // 配置菜单的属性
  menu: {
    props: {
      label: 'label',
      path: 'path',
      icon: 'icon',
      children: 'children'
    }
  },

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false
}
