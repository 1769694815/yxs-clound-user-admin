/*
 * @Author: Donkey
 * @Date: 2020-02-13 12:00:41
 * @LastEditTime: 2020-03-14 16:25:36
 * @LastEditors: xwen
 * @Description:
 */
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import 'animate.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import * as urls from '@/config/env'

import '@/icons' // icon
import '@/permission' // permission control

// 百度富文本编辑器
import '../public/UE/ueditor.config'
// import '../public/UE/ueditor.parse'
import '../public/UE/ueditor.all'
import '../public/UE/lang/zh-cn/zh-cn'
import '../public/UE/themes/default/css/ueditor.css'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'development') {
//   mockXHR()
// }

// 全局注册Xtable组件
import GL_Component from '@/assets/js/globalComponent'
Vue.use(GL_Component)

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.prototype.$upload_qiniu_url = 'https://up-z0.qiniup.com/'

// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key]
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
