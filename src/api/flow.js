import request from '@/utils/request'

export const pageListPort = (data) => request({
  url: '/api/blade-workbench/arrive/page',
  method: 'post',
  data
})

export const getModelDetailsPort = (data) => request({
  url: '/api/blade-workbench/arrive/getModel',
  method: 'post',
  data
})
export const networkPort = (url, data) => request({
  url,
  method: 'post',
  data
})

export const countDownNoticePort = (params) => request({
  url: '/api/blade-workbench/arrive/countDownNotice',
  method: 'get',
  params
})
