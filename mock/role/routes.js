/*
 * @Author: xwen
 * @Date: 2019-12-30 10:38:52
 * @LastEditTime : 2019-12-30 17:16:55
 * @LastEditors  : xwen
 * @Description: 动态路由
 */

// 基础路由
export const constantRoutes = [
  {
    path: '/login',
    component: 'login/index',
    hidden: true
  },

  {
    path: '/',
    component: 'Layout',
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: 'dashboard/index',
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/example',
    component: 'Layout',
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '例子', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: 'table/index',
        meta: { title: '表格', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: '/tree/index',
        meta: { title: '树', icon: 'tree' }
      }
    ]
  }
]

// roles包含的角色，则此角色有权限访问；无roles则所有角色全部都有权限访问，可放在基本路由中router/index.js
export const asyncRoutes = [
  {
    path: '/form',
    component: 'Layout',
    children: [
      {
        path: 'index',
        name: 'Form',
        component: 'form/index',
        meta: { title: '表单', icon: 'form', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/permission',
    component: 'Layout',
    redirect: '/permission/index',
    alwaysShow: true,
    meta: {
      title: '权限管理',
      icon: 'lock',
      roles: ['admin']
    },
    children: [
      {
        path: 'role',
        component: 'permission/role',
        name: 'RolePermission',
        meta: {
          title: '角色权限',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/nested',
    component: 'Layout',
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: '路由嵌套',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: 'nested/menu1/index',
        name: 'Menu1',
        meta: { title: '菜单1' },
        children: [
          {
            path: 'menu1-1',
            component: 'nested/menu1/menu1-1',
            name: 'Menu1-1',
            meta: { title: '菜单1-1' }
          },
          {
            path: 'menu1-2',
            component: 'nested/menu1/menu1-2',
            name: 'Menu1-2',
            meta: { title: '菜单1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: 'nested/menu1/menu1-2/menu1-2-1',
                name: 'Menu1-2-1',
                meta: { title: '菜单1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: 'nested/menu1/menu1-2/menu1-2-2',
                name: 'Menu1-2-2',
                meta: { title: '菜单1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: 'nested/menu1/menu1-3',
            name: 'Menu1-3',
            meta: { title: '菜单1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: 'nested/menu2/index',
        meta: { title: '菜单2', roles: ['editor'] }
      }
    ]
  },
  {
    path: 'external-link',
    component: 'Layout',
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: '外链', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
