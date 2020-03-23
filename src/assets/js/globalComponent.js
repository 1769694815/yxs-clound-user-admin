/*
 * @Author: xwen
 * @Date: 2020-03-03 14:20:53
 * @LastEditTime: 2020-03-21 14:03:16
 * @LastEditors: Donkey
 * @Description: 全局组件注册
 */

import Xtable from '@/components/Xtable/index'
import SingleChange from '@/components/DictItem/SingleChange'
import MutilChange from '@/components/DictItem/MutilChange'
import SingleImage from '@/components/Upload/SingleImage'
import SingleFile from '@/components/Upload/SingleFile'
import ColorPicker from '@/components/ColorPicker/index'

function plugin(Vue) {
  if (plugin.installed) {
    return
  }
  Vue.component('Xtable', Xtable)
  Vue.component('SingleChange', SingleChange)
  Vue.component('MutilChange', MutilChange)
  Vue.component('SingleImage', SingleImage)
  Vue.component('SingleFile', SingleFile)
  Vue.component('ColorPicker', ColorPicker)
}

export default plugin
