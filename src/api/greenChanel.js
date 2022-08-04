import request from '@/utils/request'

export const greenChanelInitPort = (params) => request({
  url: '/api/blade-workbench/payAudit/init',
  method: 'get',
  params
})
export const greenChanelSaveOrUpdatePort = (data) => request({
  url: '/api/blade-workbench/payAudit/saveOrUpdate',
  method: 'post',
  data
})
export const greenChanelDetailPort = (params) => request({
  url: '/api/blade-workbench/payAudit/detail',
  method: 'get',
  params
})
// 获取问卷问题列表
export const surveyFormSurveyList = (params) => request({
  url: '/api/blade-workbench/surveyAction/surveyList',
  method: 'get',
  params
})
// 保存问卷调查
export const surveyFormSaveSurvey = (data) => request({
  url: '/api/blade-workbench/surveyAction/saveSurvey',
  method: 'post',
  data
})
// 获取问卷调查回答
export const surveyFormSearchSurvey = (data) => request({
  url: '/api/blade-workbench/surveyAction/searchSurvey',
  method: 'post',
  data
})
// 清楚用户流程信息
export const clearStudentProcess = (data) => request({
  url: '/api/blade-workbench/center/clearStudentProcess',
  method: 'post',
  data
})

// 清楚用户流程信息
export const getPageListPort = (data) => request({
  url: '/api/blade-workbench/center/clearStudentProcess',
  method: 'post',
  data
})
