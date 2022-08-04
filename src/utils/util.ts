// import Vue from 'vue'
import Cookies from 'js-cookie'
import { Message } from 'view-ui-plus'

/**
 * 用于判断当前的运行环境，包括蜂巢，门户和其他
 */
export function judeEnv () {
  // 判断userAgent中是否拥有标识
  function matchUserAgent (reg:any) {
    return !!navigator.userAgent.match(reg)
  }
  function isMobileWeb () {
    var sUserAgent = navigator.userAgent.toLowerCase()
    if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(sUserAgent)) {
      return true
    } else {
      return false
    }
  }
  // 是否从蜂巢进入
  function isFengChao () {
    let bool = false
    if (matchUserAgent(/CombWebView/)) {
      bool = true
    }
    return bool
  }
  // 判断是否是微信环境
  function getIsWxClient () {
    if (matchUserAgent(/MicroMessenger/i)) {
      return true
    }
    return false
  }
  // 是否从信息门户进入
  function isXXMH () {
    let bool = false
    type theRequestType = {
      combStr:string,
      [key:string]:any
    }
    function getRequest () {
      const url = location.search // 获取url中"?"符后的字串
      const theRequest = {} as theRequestType
      if (url.indexOf('?') !== -1) {
        const str = url.substr(1)
        const strs = str.split('&')
        for (let i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = decodeURI(
            strs[i].split('=')[1]
          )
        }
      }
      return theRequest
    }
    const query = getRequest()
    if (query.combStr) {
      bool = true
      Cookies.set('combStr', query.combStr)
    }
    return bool
  }
  const environment = {
    isMobie: false,
    isFengChao: false,
    isXXMH: false,
    isWeChat: false,
    isMobileWeb: false
  }
  if (isFengChao()) {
    environment.isFengChao = true
  } else {
    environment.isFengChao = false
  }
  if (isXXMH()) {
    environment.isXXMH = true
  } else {
    environment.isXXMH = false
  }
  if (getIsWxClient()) {
    environment.isWeChat = true
  } else {
    environment.isWeChat = false
  }
  if (isMobileWeb()) {
    environment.isMobileWeb = true
  } else {
    environment.isMobileWeb = false
  }
  return environment
}

// /**
//  * 通用的Action请求函数，接收两个参数，返回一个相关的函数
//  * @param {*} params dispatch函数传递的参数
//  * @param {*} fn 要触发的异步函数一般是一个异步的ajax请求
//  */
// export async function requestAction (params, fn) {
//   const response = await fn(params)
//   if (response.data.status !== 1000) {
//     Message.error(response.data.msg)
//     return Promise.reject
//   } else {
//     return (commitType, commit) => {
//       if (typeof commitType === 'string') { commit(commitType, response.data.result) }
//       return response
//     }
//   }
// }

export const getObjType = (obj:any):any => {
  var toString = Object.prototype.toString
  var map:any = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  if (obj instanceof Element) {
    return 'element'
  }
  return map[toString.call(obj)]
}

export const isEmpty = (value:any) => {
  if (value === null || value === undefined) {
    return true
  }
  if (getObjType(value) === 'array') {
    if (value.length === 0) {
      return true
    }
  }
  if (getObjType(value) === 'object') {
    if (Object.keys(value).length === 0) {
      return true
    }
  }
  if (getObjType(value) === 'string') {
    if (value === '') {
      return true
    }
  }
  return false
}
