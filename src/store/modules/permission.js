// import { constantRoutes } from '@/router'
import { getRoutes } from '@/api/role'

import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    // console.log('tmp', tmp)
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  console.log(res)

  return res
}

/**
 * @description: 替换component
 * @param {type}
 * @return:
 */
export function dataArrayToRoutes(data) {
  // console.log('data', data)
  const res = []
  data.forEach(item => {
    const tmp = { ...item }
    if (tmp.component) {
      if (tmp.component === 'Layout') {
        tmp.component = Layout
      } else {
        let sub_view = tmp.component
        sub_view = sub_view.replace(/^\/*/g, '')
        tmp.component = () => import(`@/views/${sub_view}`) // 这里很重要，把view动态加载进来，而且似乎我只找到这样的写法，用拼接不行，然后 views 后面没有斜杆也不行
      }
    }
    if (tmp.children) {
      tmp.children = dataArrayToRoutes(tmp.children)
    }
    res.push(tmp)
  })
  return res
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
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes = []
      // 从接口获取动态路由
      getRoutes().then(res => {
        console.log('res', res)
        const asyncRoutes = dataArrayToRoutes(res.data)
        console.log('roles', roles)
        if (roles.includes('admin')) {
          accessedRoutes = asyncRoutes || []
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        }
        console.log('asyncRoutes', accessedRoutes)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
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
