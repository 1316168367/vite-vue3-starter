/* eslint-disable */
import website from '@/config/website'
import { Base64 } from 'js-base64'

import axios from 'axios'
// import { MessageBox, Message } from 'view-design'
// import {
//   Message
// } from 'view-design'
import { useUserStore } from '@/store'
import { getToken } from '@/utils/auth'
// 加解密部署时开启引入
import { encrypt, decrypt } from './encrypt'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from '@/router'
// import {
//   encrypt
// } from './encrypt'
// 需要加密的链接正则表达式，部署时开启
const encryptPath = ['blade-workbench', 'blade-system']
// const encryptPath = []
// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // headers: {
  //   'Content-type': 'application/json'
  // },
  timeout: 10000, // request timeout
})
NProgress.configure({
  showSpinner: false,
})
type paramType = {
  user_info_id: string
  user_info_name: string
  user_info_id_key_id: string
  user_info_id_key_name: string
}
function addUserInfo(param: paramType, key_id: string, user_name: string) {
  if (param.user_info_id === undefined) {
    param.user_info_id = key_id
    param.user_info_name = user_name
  } else if (param.user_info_id_key_id === undefined) {
    param.user_info_id_key_id = key_id
    param.user_info_id_key_name = user_name
  }
}
// 加解密部署时开启引入
function testEncrypt(url: string) {
  return encryptPath.find((el) => url.indexOf(el) !== -1)
}
// request interceptor
service.interceptors.request.use(
  (value) => {
    type valueType = {
      [key: string]: any
    }
    NProgress.start() // start progress bar
    const config = value as valueType
    // do something before request is sent
    config.headers['Authorization'] = `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`
    if (getToken()) {
      config.headers['Blade-Auth'] = 'bearer ' + getToken() // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
    }
    // headers中配置serialize为true开启序列化
    // if (config.method === 'post') {
    //   config.data = serialize(config.data)
    // }
    const userStore = useUserStore()
    let key_id = userStore.userInfo.account
    let user_name = userStore.userInfo.nick_name
    key_id = key_id == undefined ? '未获取/未登录' : key_id
    user_name = user_name == undefined ? '未获取/未登录' : user_name
    const isNeedEncrypt = testEncrypt(config.url)
    // 增加用户信息参数
    if (config.method !== 'get') {
      // 如果是array
      if (Array.isArray(config.data)) {
        if (typeof config.data[0] === 'object') {
          addUserInfo(config.data[0], key_id, user_name)
        }
      } // 如果是object
      else if (typeof config.data === 'object') {
        addUserInfo(config.data, key_id, user_name)
      }
    }
    // if (config.method === 'get') {
    //   if (config.url.indexOf('?') !== -1) {
    //     config.url += '&user_info_id=' + key_id + '&user_info_name=' + user_name
    //   } else {
    //     config.url += '?user_info_id=' + key_id + '&user_info_name=' + user_name
    //   }
    // }
    if (config.method === 'get') {
      if (config.url.indexOf('?') !== -1) {
        config.url += '&user_info_id=' + encodeURIComponent(key_id) + '&user_info_name=' + encodeURIComponent(user_name)
      } else {
        config.url += '?user_info_id=' + encodeURIComponent(key_id) + '&user_info_name=' + encodeURIComponent(user_name)
      }
    }
    // 加密操作，部署时开启
    if (isNeedEncrypt && config.method !== 'get') {
      if (config.headers['Content-Type'] != 'multipart/form-data') {
        console.log(`请求url:${config.url} \n请求参数:`, config.data)
        config.data = {
          data: encrypt(config.data, config.url),
        }
      }
    }
    if (isNeedEncrypt && config.method === 'get') {
      if (config.url.indexOf('?') !== -1) {
        config.url += '&time=' + new Date().getTime()
      } else {
        config.url += '?time=' + new Date().getTime()
      }
    }
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    // return Promise.reject(error)
    return {
      data: {
        status: 8008,
        msg: error.message,
      },
    }
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (value) => {
    NProgress.done()
    type configType = {
      url: string
      [key: string]: any
    }
    type resType = {
      config: configType
      [key: string]: any
    }
    const res = value as resType
    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    const isNeedDecrypt = testEncrypt(res.config.url)
    // console.log('resObj', res)
    // 解密操作,部署时开启
    if (res.data && res.data.result && typeof res.data.result === 'string' && isNeedDecrypt) {
      try {
        // console.log(res, '2222222')
        res.data.result = decrypt(res.data.result)
        console.log(`请求url:${res.request.responseURL} \n返回参数:}`, res)
      } catch (e) {
        console.error(e)
      }
    }
    return res
  },
  (error) => {
    NProgress.done()
    console.log(`err${error}`) // for debug

    const status = error.response.status

    //如果是401则跳转到登录页面
    if (status === 401) {
      router.replace({ path: '/login' })
    }

    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 3 * 1000
    // })
    // return Promise.reject(error)
    return {
      data: {
        status: 8008,
        msg: error.message,
      },
    }
  }
)

export default service
