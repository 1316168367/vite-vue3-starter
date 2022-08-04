import request from '@/utils/request'

export const loginOut = (accessToken: string) =>
  request({
    url: '/api/blade-workbench/auth/loginOut',
    method: 'get',
    headers: {
      'access-token': accessToken,
    },
  })

export const getAddress = (params:object) =>
  request({
    url: '/api/blade-workbench/auth/getAddress',
    method: 'post',
    data: params,
  })

export const loginByTicket = (params:object) =>
  request({
    url: '/api/blade-workbench/auth/auth/modelLogin',
    method: 'post',
    data: params,
  })

export const getUserInfo = () =>
  request({
    url: '/api/blade-user/user/getUserInfo',
    method: 'get',
  })

export const refreshToken = (refreshToken: string, tenantId: string) =>
  request({
    url: '/api/blade-auth/oauth/token',
    method: 'post',
    headers: {
      'Tenant-Id': tenantId,
    },
    params: {
      tenantId,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      scope: 'all',
    },
  })

export const getIndexInfoPort = () =>
  request({
    url: '/api/blade-workbench/indexService/h5/index',
    method: 'get',
  })

export const getSignature = (params:object) =>
  request({
    url: '/api/blade-workbench/nobody/weixin/getJsTokenAndSignature',
    method: 'post',
    data: params,
  })

export const combLoginToMicroService = (params:object) =>
  request({
    url: '/api/blade-workbench/nobody/weixin/combLoginToMicroService',
    method: 'post',
    data: params,
  })
