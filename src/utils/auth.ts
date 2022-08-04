import Cookies from 'js-cookie'
import website from '@/config/website'
import { encrypt, decrypt } from './encrypt'
import { setStore, getStore, removeStore } from '@/utils/store'

const TokenKey = website.key + '-' + 'x-access-token'
const RefreshTokenKey = website.key + '-' + 'x-refresh-token'

export function setTokenWithTime(key:string, value:string, time:string) {
  return Cookies.set(key, encrypt(value,''), {
    expires: time,
  })
}

export function getTokenWithTime(key:string) {
  const temp = Cookies.get(key)
  return temp !== '' && temp !== undefined ? decrypt(temp) : temp
}

export function setToken(token:string) {
  return setStore({
    name: TokenKey,
    content: {
      data: token,
      time: new Date().getTime() + 2 * 60 * 60 * 1000,
    },
    type: 'session',
  })
}

export function getToken() {
  const result = getStore({
    name: TokenKey,
    type: 'session',
  })

  if (result !== undefined && result.time > new Date().getTime()) {
    return result.data
  }
  return null
}
export function getRefreshToken() {
  const result = getStore({
    name: RefreshTokenKey,
    type: 'session',
  })

  if (result !== undefined && result.time > new Date().getTime()) {
    return result.data
  }
  return null
}

export function setRefreshToken(token:string) {
  return setStore({
    name: RefreshTokenKey,
    content: {
      data: token,
      time: new Date().getTime() + 2 * 60 * 60 * 1000,
    },
    type: 'session',
  })
}

export function removeToken() {
  return removeStore({ name: TokenKey, type: 'session' })
}

export function removeRefreshToken() {
  return removeStore({ name: RefreshTokenKey, type: 'session' })
}
