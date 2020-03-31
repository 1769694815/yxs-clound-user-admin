import { login, logout, getInfo } from '@/api/user'
import { getStore, setStore } from '@/utils/store'
import { resetRouter, constantRoutes } from '@/router'
import { deepClone, encryption } from '@/utils/index'
import { isURL, validatenull } from '@/utils/validate'
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
  // console.log(first)
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

    // 特殊处理组件
    const component = 'views' + oMenu.path

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
          require(['@/layout/index'], resolve)
          // 判断是否为多层路由
        } else if (isChild && !first) {
          require(['@/layout/layout'], resolve)

          // 判断是否为最终的页面视图
        } else {
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
  return aRouter
  // if (first) {
  //   // console.log('routerList', routerList)
  //   // console.log('aRouter', aRouter[0][propsDefault.path])
  //   // if (!routerList.includes(aRouter[0][propsDefault.path])) {
  //   //   // this.$router.addRoutes(aRouter)
  //   //   console.log('aRouter', aRouter)
  //   //   routerList.push(aRouter[0][propsDefault.path])
  //   //   return aRouter
  //   // }
  //   return aRouter
  // } else {
  //   console.log('最后的数据', aRouter)
  //   return aRouter
  // }
}

const state = {
  userInfo: {},
  permissions: {},
  roles: [],
  tenantId: '',
  expires_in: getStore({
    name: 'expires_in'
  }) || '',
  access_token: getStore({
    name: 'access_token'
  }) || '',
  refresh_token: getStore({
    name: 'refresh_token'
  }) || '',
  routes: getStore({
    name: 'menu'
  }) || [],
  addRoutes: []
}

const mutations = {
  RESET_STATE: (state) => {
    // Object.assign(state, state)
  },
  SET_ACCESS_TOKEN: (state, access_token) => {
    state.access_token = access_token
    setStore({
      name: 'access_token',
      content: state.access_token,
      type: 'session'
    })
  },
  SET_TENANTID: (state, tenantId) => {
    state.tenantId = tenantId
    setStore({
      name: 'tenantId',
      content: state.tenantId,
      type: 'session'
    })
  },
  SET_EXPIRES_IN: (state, expires_in) => {
    state.expires_in = expires_in
    setStore({
      name: 'expires_in',
      content: state.expires_in,
      type: 'session'
    })
  },
  SET_REFRESH_TOKEN: (state, rfToken) => {
    state.refresh_token = rfToken
    setStore({
      name: 'refresh_token',
      content: state.refresh_token,
      type: 'session'
    })
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    const list = {}
    for (let i = 0; i < permissions.length; i++) {
      list[permissions[i]] = true
    }
    state.permissions = list
  },
  SET_ROUTES: (state, params = {}) => {
    const { type, asyncRoutes } = params
    if (type !== false) {
      state.addRoutes = asyncRoutes
      state.routes = asyncRoutes
    }
    setStore({
      name: 'menu',
      content: asyncRoutes,
      type: 'session'
    })
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const user = encryption({
      data: userInfo,
      key: 'pigxpigxpigxpigx',
      param: ['password']
    })
    return new Promise((resolve, reject) => {
      login(user.username, user.password, user.code, user.randomStr).then(response => {
        const data = response.data
        commit('SET_ACCESS_TOKEN', data.access_token)
        commit('SET_REFRESH_TOKEN', data.refresh_token)
        console.log('新插入的租户id', data.tenant_id)
        commit('SET_TENANTID', data.tenant_id)
        commit('SET_EXPIRES_IN', data.expires_in)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const data = response.data.data || {}
        commit('SET_USER_INFO', data.sysUser)
        commit('SET_ROLES', data.roles || [])
        commit('SET_PERMISSIONS', data.permissions || [])
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取系统菜单
  getMenu({ commit }, obj) {
    return new Promise((resolve, reject) => {
      getMenu().then(response => {
        const data = response.data.data || {}
        const menu = deepClone(data)
        menu.forEach(ele => {
          addPath(ele)
        })
        const type = obj.type
        const asyncRoutes = constantRoutes.concat(formatRoutes(menu, true))
        commit('SET_ROUTES', { type, asyncRoutes })
        resolve(asyncRoutes)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_USER_INFO', {})
        commit('SET_ACCESS_TOKEN', '')
        commit('SET_REFRESH_TOKEN', '')
        commit('SET_TENANTID', '')
        commit('SET_EXPIRES_IN', '')
        commit('SET_ROLES', [])
        commit('SET_ROUTES', [])
        commit('SET_PERMISSIONS', [])
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 注销session
  fedLogOut({ commit }) {
    return new Promise(resolve => {
      resetRouter()
      commit('SET_USER_INFO', {})
      commit('SET_ACCESS_TOKEN', '')
      commit('SET_REFRESH_TOKEN', '')
      commit('SET_TENANTID', '')
      commit('SET_EXPIRES_IN', '')
      commit('SET_ROLES', [])
      commit('SET_ROUTES', [])
      commit('SET_PERMISSIONS', [])
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

