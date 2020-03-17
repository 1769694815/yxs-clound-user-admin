/*
 * @Author: xwen
 * @Date: 2020-03-03 14:20:53
 * @LastEditTime: 2020-03-10 14:32:39
 * @LastEditors: xwen
 * @Description: 全局组件注册
 */

import Xtable from '@/components/Xtable/index'
import SingleChange from '@/components/DictItem/SingleChange'
import SingleImage from '@/components/Upload/SingleImage'
import SingleFile from '@/components/Upload/SingleFile'
import ColorPicker from '@/components/ColorPicker/index'

function plugin(Vue) {
  if (plugin.installed) {
    return
  }
  Vue.component('Xtable', Xtable)
  Vue.component('SingleChange', SingleChange)
  Vue.component('SingleImage', SingleImage)
  Vue.component('SingleFile', SingleFile)
  Vue.component('ColorPicker', ColorPicker)
}

export default plugin
