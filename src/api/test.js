import request from '@/utils/request'

// 服务配置
// 获取配置详情
export const getSettingDetailsPort = () => {
  return request({
    url: '/api/blade-workbench/patrioticThemeEduProblem/getPatrioticThemeServiceConfig',
    method: 'get'
  })
}
// 获取学生答题状态
export const getStudentStatusPort = () => {
  return request({
    url: '/api/blade-workbench/patrioticThemeEduStatistics/getStudentStatus',
    method: 'get'
  })
}

// 保存
export const saveConfigPort = (data) => {
  return request({
    url: '/api/blade-workbench/patrioticThemeEduStatistics/saveResult',
    method: 'post',
    data
  })
}

// 保存
export const getExamDetailsListPort = (data) => {
  return request({
    url: '/api/blade-workbench/patrioticThemeEduProblem/getExamDetailsList',
    method: 'post',
    data
  })
}
