<script setup lang="ts">
import { useUserStore } from '@/store'
import { setStore, getStore } from '@/utils/store'
import { validatenull } from '@/utils/validate'
import { calcDate } from '@/utils/date'

let refreshLock = false
let refreshTime: any = null

const userStore = useUserStore()
const environment: any = inject('environment') //关键代码

const stateToken = computed(() => {
  return userStore.token
})
const website: any = computed(() => {
  return userStore.website
})

onMounted(() => {
  console.log(environment)
  console.log('这是在ipad上编辑的');
  
  // console.log(environment)

  if (environment.isFengChao) {
    window.jsApi.login({ appKey: '0000' })
  }
})

watch(
  stateToken,
  (newValue, oldValue) => {
    if (stateToken && refreshTime === '') {
      refreshToken()
    }
  },
  //可选
  { deep: true, immediate: true }
)
const refreshToken = () => {
  refreshTime = setInterval(() => {
    const token = getStore({
      name: 'token',
      debug: true,
    })
    const date = calcDate(token.datetime, new Date().getTime())
    if (validatenull(date)) {
      return
    }
    if (date.seconds >= website.tokenTime && !refreshLock) {
      refreshLock = true
      userStore
        .refreshToken2()
        .then(() => {
          refreshLock = false
        })
        .catch(() => {
          refreshLock = false
        })
    }
  }, 10000)
}
</script>

<template>
  <router-view />
</template>
<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
}
</style>
