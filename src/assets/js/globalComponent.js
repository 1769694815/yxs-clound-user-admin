/*
 * @Author: xwen
 * @Date: 2020-03-03 14:20:53
 * @LastEditTime: 2020-03-04 11:24:19
 * @LastEditors: xwen
 * @Description: 全局组件注册
 */

import Xtable from '@/components/Xtable/index'
import SingleChange from '@/components/DictItem/SingleChange'
import SingleImage from '@/components/Upload/SingleImage'

function plugin(Vue) {
  if (plugin.installed) {
    return
  }
  Vue.component('Xtable', Xtable)
  Vue.component('SingleChange', SingleChange)
  Vue.component('SingleImage', SingleImage)
}

export default plugin
