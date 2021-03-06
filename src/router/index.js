import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/info',
    component: Layout,
    redirect: '/info/index',
    hidden: true,
    children: [{
      path: 'index',
      name: 'UserInfo',
      component: () => import('@/views/admin/user/info'),
      meta: { title: '个人信息' }
    }]
  },

  {
    path: '/course/coursechapter',
    component: Layout,
    redirect: '/course/coursechapter/index',
    hidden: true,
    children: [{
      path: 'index',
      name: 'Coursechapter',
      component: () => import('@/views/course/coursechapter'),
      meta: { title: '章节管理' }
    }]
  },
  {
    path: '/course/courselesson',
    component: Layout,
    redirect: '/course/courselesson/index',
    hidden: true,
    children: [{
      path: 'index',
      name: 'Courselesson',
      component: () => import('@/views/course/courselesson'),
      meta: { title: '课时管理' }
    }]
  },
  {
    path: '/course/coursestudent',
    component: Layout,
    redirect: '/course/coursestudent/index',
    hidden: true,
    children: [{
      path: 'index',
      name: 'Coursestudent',
      component: () => import('@/views/course/coursestudent'),
      meta: { title: '学员管理' }
    }]
  },
  {
    path: '/course/importlog',
    component: Layout,
    redirect: '/course/importlog/index',
    hidden: true,
    children: [{
      path: 'index',
      name: 'CourseImportlog',
      component: () => import('@/views/course/importlog'),
      meta: { title: '导入记录' }
    }]
  },
  {
    path: '/classroom/classroomstudent',
    component: Layout,
    redirect: '/classroom/classroomstudent/index',
    hidden: true,
    children: [{
      path: 'index',
      name: 'Classroomstudent',
      component: () => import('@/views/classroom/classroomstudent'),
      meta: { title: '学员管理' }
    }]
  },
  {
    path: '/classroom/importlog',
    component: Layout,
    redirect: '/classroom/importlog/index',
    hidden: true,
    children: [{
      path: 'index',
      name: 'ClassroomImportlog',
      component: () => import('@/views/classroom/importlog'),
      meta: { title: '导入记录' }
    }]
  },
  {
    path: '/question/batchImport',
    component: Layout,
    redirect: '/question/batchImport/index',
    hidden: true,
    children: [{
      path: 'index',
      name: 'batchImport',
      component: () => import('@/views/question/batchImport'),
      meta: { title: '批量录入' }
    }]
  },
  {
    path: '/question/proofread',
    component: Layout,
    redirect: '/question/proofread/index',
    hidden: true,
    children: [{
      path: 'index',
      name: 'proofread',
      component: () => import('@/views/question/proofread'),
      meta: { title: '题目校对' }
    }]
  },
  {
    path: '/orders/tenantorder',
    component: Layout,
    redirect: '/orders/tenantorder/index',
    hidden: true,
    children: [{
      path: 'index',
      name: 'tenantorder',
      component: () => import('@/views/orders/tenantorder'),
      meta: { title: '充值记录' }
    }]
  },
  {
    path: '/admin/systenanttask',
    component: Layout,
    redirect: '/admin/systenanttask/index',
    hidden: true,
    children: [{
      path: 'index',
      name: 'systenanttask',
      component: () => import('@/views/admin/systenanttask'),
      meta: { title: '租户创建记录' }
    }]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: '路由嵌套',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: '菜单1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: '菜单1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: '菜单1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: '菜单1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: '菜单1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: '菜单1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: '菜单2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
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

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
