import { login, logout, getInfo } from '@/api/user'
import { getStore, setStore } from '@/utils/store'
import { removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { encryption } from '@/utils/index'

const state = {
  userInfo: {},
  permissions: {},
  roles: [],
  expires_in: getStore({
    name: 'expires_in'
  }) || '',
  access_token: getStore({
    name: 'access_token'
  }) || '',
  refresh_token: getStore({
    name: 'refresh_token'
  }) || ''
}

const mutations = {
  RESET_STATE: (state) => {
    // Object.assign(state, state)
  },
  SET_ACCESS_TOKEN: (state, access_token) => {
    console.log(access_token)
    state.access_token = access_token
    setStore({
      name: 'access_token',
      content: state.access_token,
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
        console.log(data)
        commit('SET_ACCESS_TOKEN', data.access_token)
        commit('SET_REFRESH_TOKEN', data.refresh_token)
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
        console.log('userInfo', data)
        commit('SET_USER_INFO', data.sysUser)
        commit('SET_ROLES', data.roles || [])
        commit('SET_PERMISSIONS', data.permissions || [])
        resolve(data)
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
        commit('SET_EXPIRES_IN', '')
        commit('SET_ROLES', [])
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
      commit('SET_ROLES', [])
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

