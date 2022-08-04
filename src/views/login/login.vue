<template>
  <div class="login-container"></div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store'
const modelName = 'SERVICE_CENTER'
const returnPath = '/'
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const $Spin: any = inject('$Spin')
const $message: any = inject('$Message')
const environment: any = inject('environment')
onBeforeMount(async () => {
  // debugger
  const query = route.query
  // 查看 query 参数
  console.log(query)
  if (query.logout) {
    if (environment.isFengChao) {
      await window.jsApi.closeWebView()
    } else {
      jumpToLogin(query.logout)
    }
  } else if (query.ticket) {
    // 如果存在 ticket 则尝试消费
    handleTicket(query.ticket)
  } else if (environment.isFengChao) {
    // 客户端自我认证能力 serviceUrl 需根据实际情况修改
    let serviceUrl = modelName
    const tempUrl = window.location.origin + (window.location.pathname === '/' ? '' : window.location.pathname) + '#/login'
    serviceUrl += '-' + encodeURIComponent(tempUrl)
    await window.jsApi.login({ appKey: '0000' })
    const jsRes = await window.jsApi.getEduUserInfo()
    console.log('isFengChao getEduUserInfo jsRes', jsRes)
    const { status, result } = jsRes
    if (status === 0) {
      console.log('isFengChao getEduUserInfo', result)
      const combLogin = await userStore.combLoginToMicroService({
        modelName: serviceUrl,
        userId: result.KEY_ID,
      })
      console.log('isFengChao getEduUserInfo combLoginToMicroService result', combLogin)
      if (combLogin.status === 1000) {
        const kv = combLogin.result
        if (kv.code === 200) {
          // await window.jsApi.hiddenNavigation()
          router.replace({ path: returnPath })
        }
      }
    } else {
      // 不做处理
      jumpToLogin('')
    }
  } else {
    jumpToLogin('')
  }
})
const handleTicket = (ticket: any) => {
  $Spin.show({
    render: (h: any) => {
      return h('div', [
        h('Icon', {
          class: 'demo-spin-icon-load',
          props: {
            type: 'ios-loading',
            size: 18,
          },
        }),
        h('div', '登录中，请稍后'),
      ])
    },
  })
  userStore
    .loginByTicket({ ticket: ticket })
    .then((res: any) => {
      console.log(res)
      if (res.data.status !== 1000) {
        jumpToLogin('')
      } else {
        setTimeout(() => {
          // console.log(this.$router)
          router.replace({ path: '/' })
        }, 500)
      }
      $Spin.hide()
    })
    .catch((error: string) => {
      console.log(error)
      $Spin.hide()
    })
}
const jumpToLogin = (logout: any) => {
  $Spin.show({
    render: (h: any) => {
      return h('div', [
        h('Icon', {
          class: 'demo-spin-icon-load',
          props: {
            type: 'ios-loading',
            size: 18,
          },
        }),
        h('div', '登录中，请稍后'),
      ])
    },
  })
  // const that = this
  // debugger
  userStore
    .getAddress({ modelName: 'SERVICE_AUTH' })
    .then((res: any) => {
      console.log(res)
      // debugger
      if (res.data.status === 1000) {
        const resArray = res.data.result[0]
        console.log('resArray', JSON.stringify(resArray))
        if (resArray !== undefined) {
          let serviceUrl = 'modelName=' + modelName
          // if (process.env.NODE_ENV === 'development') {
          //   serviceUrl += '-' + encodeURIComponent(window.location.origin + '/#/login')
          // }

          var domain = resArray.remark.split('/') // 以“/”进行分割
          if (domain[2]) {
            domain = domain[2]
          } else {
            domain = '' // 如果url不正确就取空
          }

          const tempUrl = window.location.origin + (window.location.pathname === '/' ? '' : window.location.pathname) + '#/login'
          // if (tempUrl.indexOf(domain) === -1) {
          serviceUrl += '-' + encodeURIComponent(tempUrl)
          // }

          resArray.remark += (serviceUrl.indexOf('?') !== -1 ? '&' : '?') + serviceUrl

          if (logout !== undefined) {
            resArray.remark += (resArray.remark.indexOf('?') !== -1 ? '&' : '?') + 'logOut=out'
          }
          if (route.query.otherLogin !== undefined) {
            resArray.remark += (resArray.remark.indexOf('?') !== -1 ? '&' : '?') + 'otherLogin=true'
          }

          console.log('remark', resArray.remark)
          window.location.replace(resArray.remark)
        } else {
          $message('认证中心地址获取失败!')
        }
      }
      $Spin.hide()
    })
    .catch((error) => {
      console.log(error)
      // loading.close()
      $Spin.hide()
    })
}
</script>
<style lang="scss">
.login-container {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  animation: animate-cloud 20s linear infinite;
}
</style>
