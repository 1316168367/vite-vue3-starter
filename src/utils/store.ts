import {
  validatenull
} from './validate'
import website from '@/config/website'
// 加解密部署时开启引入
import { encrypt, decrypt } from './encrypt'

const keyName = website.key + '-'
type paramsType = {
  name?:string
  debug?:string
  content?:string
  type?:boolean
  [Key:string]: any
}
/**
* 存储localStorage
*/
export const setStore = (params={}) => {
  let {
    name,
    content,
    type
  } = params as paramsType
  name = keyName + name
  const obj = {
    dataType: typeof (content),
    content: encrypt(content,''),
    type: type,
    datetime: new Date().getTime()
  }
  if (type) window.sessionStorage.setItem(name, JSON.stringify(obj))
  else window.localStorage.setItem(name, JSON.stringify(obj))
}
/**
* 获取localStorage
*/

export const getStore = (params = {}) => {
  let {
    name,
    debug
  } = params as paramsType
  name = keyName + name
  let obj:any
  let content
  obj = window.sessionStorage.getItem(name)
  if (validatenull(obj)) obj = window.localStorage.getItem(name)
  if (validatenull(obj)) return
  try {
    obj = JSON.parse(obj)
  } catch {
    return obj
  }
  if (debug) {
    return obj
  }

  // 加解密部署时开启引入
  obj.content = decrypt(obj.content)

  if (obj.dataType === 'string') {
    content = obj.content
  } else if (obj.dataType === 'number') {
    content = Number(obj.content)
  } else if (obj.dataType === 'boolean') {
    // eslint-disable-next-line no-eval
    content = eval(obj.content)
  } else if (obj.dataType === 'object') {
    content = obj.content
  }
  return content
}
/**
* 删除localStorage
*/
export const removeStore = (params = {}) => {
  let {
    name,
    type
  } = params as paramsType
  name = keyName + name
  if (type) {
    window.sessionStorage.removeItem(name)
  } else {
    window.localStorage.removeItem(name)
  }
}

/**
* 获取全部localStorage
*/
export const getAllStore = (params = {}) => {
  const list = []
  const {
    type
  } = params as paramsType
  if (type) {
    for (let i = 0; i <= window.sessionStorage.length; i++) {
      list.push({
        name: window.sessionStorage.key(i),
        content: getStore({
          name: window.sessionStorage.key(i),
          type: 'session'
        })
      })
    }
  } else {
    for (let i = 0; i <= window.localStorage.length; i++) {
      list.push({
        name: window.localStorage.key(i),
        content: getStore({
          name: window.localStorage.key(i)
        })
      })
    }
  }
  return list
}

/**
* 清空全部localStorage
*/
export const clearStore = (params = {}) => {
  const { type } = params as paramsType
  if (type) {
    window.sessionStorage.clear()
  } else {
    window.localStorage.clear()
  }
}
