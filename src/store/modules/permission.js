import { constantRoutes } from '@/router'

import { isURL, validatenull } from '@/utils/validate'
import { deepClone } from '@/utils/index'
import { getMenu } from '@/api/admin/menu'
import webiste from '@/settings'

function addPath(ele, first) {
  const menu = webiste.menu
  const propsConfig = menu.props
  const propsDefault = {
    label: propsConfig.label || 'name',
    path: propsConfig.path || 'path',
    icon: propsConfig.icon || 'icon',
    children: propsConfig.children || 'children'
  }
  const icon = ele[propsDefault.icon]
  ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon
  const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0
  if (!isChild) ele[propsDefault.children] = []
  if (!isChild && first && !isURL(ele[propsDefault.path])) {
    ele[propsDefault.path] = ele[propsDefault.path] + '/index'
  } else {
    ele[propsDefault.children].forEach(child => {
      addPath(child)
    })
  }
}

const routerList = []

function formatRoutes(aMenu = [], first) {
  const aRouter = []
  const propsConfig = webiste.menu.props
  const propsDefault = {
    label: propsConfig.label || 'label',
    path: propsConfig.path || 'path',
    icon: propsConfig.icon || 'icon',
    children: propsConfig.children || 'children',
    meta: propsConfig.meta || 'meta'
  }
  if (aMenu.length === 0) return
  for (let i = 0; i < aMenu.length; i++) {
    const oMenu = aMenu[i]
    console.log('oMenu', oMenu)
    if (routerList.includes(oMenu[propsDefault.path])) return
    const path = (() => {
      if (!oMenu[propsDefault.path]) {
        return
      } else if (first) {
        return oMenu[propsDefault.path].replace('/index', '')
      } else {
        return oMenu[propsDefault.path]
      }
    })()

    console.log('path', path)

    // 特殊处理组件
    const component = 'views' + oMenu.path

    console.log(component)

    const name = oMenu[propsDefault.label]

    const icon = oMenu[propsDefault.icon]

    const children = oMenu[propsDefault.children]

    const meta = {
      keepAlive: Number(oMenu['keepAlive']) === 0,
      title: name,
      icon
    }
    const isChild = children.length !== 0
    const oRouter = {
      path: path,
      component(resolve) {
        // 判断是否为首路由
        if (first) {
          require(['@/layout'], resolve)
          console.log('resolve', resolve)
          // 判断是否为多层路由
        } else if (isChild && !first) {
          console.log('resolve', resolve)
          require(['@/layout'], resolve)

          // 判断是否为最终的页面视图
        } else {
          console.log('resolve', resolve)
          require([`@/${component}.vue`], resolve)
        }
      },
      name: name,
      icon: icon,
      meta: meta,
      redirect: (() => {
        if (!isChild && first && !isURL(path)) return `${path}/index`
        else return ''
      })(),
      // 处理是否为一级路由
      children: !isChild ? (() => {
        if (first) {
          if (!isURL(path)) oMenu[propsDefault.path] = `${path}/index`
          return [{
            component(resolve) { require([`@/${component}.vue`], resolve) },
            icon: icon,
            name: name,
            meta: meta,
            path: 'index'
          }]
        }
        return []
      })() : (() => {
        return formatRoutes(children, false)
      })()
    }
    aRouter.push(oRouter)
  }
  if (first) {
    if (!routerList.includes(aRouter[0][propsDefault.path])) {
      // this.$router.addRoutes(aRouter)
      routerList.push(aRouter[0][propsDefault.path])
    }
  } else {
    return aRouter
  }
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = routes
  }
}

const actions = {
  // 获取系统菜单
  getMenu({ commit }, obj) {
    return new Promise((resolve, reject) => {
      getMenu().then(response => {
        const data = response.data.data || {}
        const menu = deepClone(data)
        menu.forEach(ele => {
          addPath(ele)
        })
        // let type = obj.type
        // commit('SET_MENU', {type, menu})
        const asyncRoutes = constantRoutes.concat(formatRoutes(menu))
        console.log('asyncRoutes', asyncRoutes)
        commit('SET_ROUTES', asyncRoutes)
        resolve(asyncRoutes)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
