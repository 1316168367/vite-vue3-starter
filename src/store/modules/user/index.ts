import { defineStore } from 'pinia'
import { setToken, setRefreshToken, removeToken, removeRefreshToken } from '@/utils/auth'
import { Message } from 'view-ui-plus'
import { setStore, getStore } from '@/utils/store'
import { getSignature, getAddress, loginByTicket, refreshToken, loginOut, getUserInfo, combLoginToMicroService } from '@/api/user'
import website from '@/config/website'
import { UserState, getAddressData, loginByTicketParam, getSignatureParam, combLoginToMicroServiceParam } from './types'
interface LoginData {
  status: number
  result: object
  message?: string
  msg?: string
}
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    tenantId:
      getStore({
        name: 'tenantId',
      }) || '',
    userInfo:
      getStore({
        name: 'userInfo',
      }) || '',
    token:
      getStore({
        name: 'token',
      }) || '',
    refreshToken:
      getStore({
        name: 'refreshToken',
      }) || '',
    website: website,
    handleConfirm: {},
    nowStudentInfo:
      getStore({
        name: 'nowStudentInfo',
      }) || '',
  }),
  actions: {
    loginOut() {
      // console.log(commit)
      return new Promise((resolve, reject) => {
        loginOut(getStore({ name: 'token' }))
          .then((res: any) => {
            setToken('')
            this.token = ''
            setStore({
              name: 'token',
              content: '',
              type: 'session',
            })
            this.userInfo = {}
            setStore({
              name: 'userInfo',
              content: this.userInfo,
              type: 'session',
            })
            removeToken()
            removeRefreshToken()
            resolve(res)
          })
          .catch((error: string) => {
            reject(error)
          })
      })
    },
    getAddress(param: getAddressData) {
      return new Promise((resolve, reject) => {
        console.log(resolve, reject);
        // debugger
        getAddress(param)
          .then((res: { data: LoginData }) => {
            const data = res.data
            // const result = res.data.result;
            if (data.status !== 1000) {
              Message.error({
                content: data.msg || data.message,
              })
            }
            resolve(res)
          })
          .catch((error: string) => {
            reject(error)
          })
      })
    },

    // 根据用户名登录
    loginByTicket(param: loginByTicketParam) {
      return new Promise((resolve, reject) => {
        loginByTicket(param)
          .then((res: { data: LoginData }) => {
            const data = res.data
            type ResultType = {
              access_token: string
              [key: string]: any
            }
            const result = res.data.result as ResultType
            if (data.status !== 1000) {
              Message.error({
                content: data.msg || data.message,
              })
            } else {
              setToken(result.access_token)
              this.token = result.access_token
              setStore({
                name: 'token',
                content: this.token,
                type: 'session',
              })
              setRefreshToken(result.refreshToken)
              this.refreshToken = result.refresh_token
              setStore({
                name: 'refreshToken',
                content: this.refreshToken,
                type: 'session',
              })
              this.tenantId = result.tenant_id
              setStore({
                name: 'tenantId',
                content: this.tenantId,
                type: 'session',
              })
              this.userInfo = result
              setStore({
                name: 'userInfo',
                content: this.userInfo,
                type: 'session',
              })
            }
            resolve(res)
          })
          .catch((error: string) => {
            reject(error)
          })
      })
    },
    GetUserInfo() {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((res: any) => {
            const data = res.data.data
            // commit('SET_ROLES', data.roles)
            resolve(data)
          })
          .catch((err: string) => {
            reject(err)
          })
      })
    },
    // 刷新token
    refreshToken2() {
      return new Promise((resolve, reject) => {
        refreshToken(this.refreshToken, this.tenantId)
          .then((res: { data: object }) => {
            type resType = {
              access_token: string
              refresh_token: string
              [key: string]: any
            }
            const data = res.data as resType
            setToken(data.access_token)
            this.token = data.access_token
            setStore({
              name: 'token',
              content: this.token,
              type: 'session',
            })
            setRefreshToken(data.refreshToken)
            this.refreshToken = data.refresh_token
            setStore({
              name: 'refreshToken',
              content: this.refreshToken,
              type: 'session',
            })
            // commit('SET_TOKEN', data.access_token)
            // commit('SET_REFRESH_TOKEN', data.refresh_token)
            resolve(data)
          })
          .catch((error: string) => {
            reject(error)
          })
      })
    },
    getSignature(param: getSignatureParam) {
      return new Promise((resolve, reject) => {
        getSignature(param)
          .then((res: { data: object }) => {
            type resType = {
              msg?: string
              message?: string
              [key: string]: any
            }
            const data = res.data as resType
            if (data.status !== 1000) {
              Message.error({
                content: data.msg || data.message,
              })
            }
            resolve(res)
          })
          .catch((error: string) => {
            reject(error)
          })
      })
    },
    combLoginToMicroService(param: combLoginToMicroServiceParam):any {
      return new Promise((resolve, reject) => {
        combLoginToMicroService(param)
          .then((res: { data: LoginData }) => {
            const data = res.data
            type resultType = {
              data: object
              [key: string]: any
            }
            type resultTType = {
              data: object
              [key: string]: any
            }
            const result = res.data.result as resultType
            const resultT = result.data as resultTType
            console.log('combLoginToMicroService', JSON.stringify(data))
            if (data.status !== 1000 || result.code !== 200) {
              new Message({
                message: data.msg || data.message,
                type: 'error',
              })
              // Message.error({
              //   content: data.msg || data.message
              // })
            } else {
              setToken(resultT.access_token)
              this.token = resultT.access_token
              setStore({
                name: 'token',
                content: this.token,
                type: 'session',
              })
              setRefreshToken(resultT.refreshToken)
              this.refreshToken = resultT.refresh_token
              setStore({
                name: 'refreshToken',
                content: this.refreshToken,
                type: 'session',
              })
              this.tenantId = resultT.tenant_id
              setStore({
                name: 'tenantId',
                content: this.tenantId,
                type: 'session',
              })
              this.userInfo = resultT
              setStore({
                name: 'userInfo',
                content: this.userInfo,
                type: 'session',
              })
              resolve(data)
            }
          })
          .catch((error: string) => {
            reject(error)
          })
      })
    },
  },
})
// export default user
