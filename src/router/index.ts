import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/index.vue'), // 懒加载组件
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue'), // 懒加载组件
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
router.beforeEach((to:any, from, next) => {
  const userStore = useUserStore()
  // console.log(to, from)
  const filterArr = ['login']
  console.log(userStore.userInfo);
  
  if (filterArr.indexOf(to.name) !== -1) {
    next()
  } else if (!userStore.userInfo) {
    next({ name: 'login', replace: true })
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  // const path = window.location.href.split('#')[0]
  const path = window.location.href
  // if (!sessionStorage.getItem('initLink')) {
  // // 解决ios微信下，分享签名不成功的问题,将第一次的进入的url缓存起来。
  //   sessionStorage.setItem('initLink', path)
  // }
  let url
  if (window.__wxjs_is_wkwebview) {
  // ios
    // url = sessionStorage.getItem('initLink')
    url = path
  } else {
    // 安卓 process.env.BASE_URL 自己定义各个环境下域名变量
    url = path
    if (to.path !== '/login' && url.indexOf('?') !== -1) {
      url = url.substring(0, url.substring(0, url.indexOf('?')).lastIndexOf('/') + 1)
    }
    // 判断/ 是否有# 有# 要有/#/
    if (url.indexOf('#') !== -1 && url.charAt(url.indexOf('#') - 1) !== '/') {
      url = url.substring(0, url.indexOf('#')) + '/' + url.substring(url.indexOf('#'), url.length)
    }
  }
  // store.commit('page/setInitLink', url)
})
export default router
