import request from '@/utils/request'

async function req(url: string | undefined, methods: string, dictParam: {}) {
  const response = await request({
    url: url,
    method: methods,
    data: dictParam,
  })
  if (response.data !== undefined) {
    return response.data
  } else {
    return null
  }
}
async function reqP(url: string | undefined, query: string | undefined) {
  const response = await request({
    url: url,
    method: 'post',
    data: query,
  })
  //   console.log(reqP)
  if (response.data !== undefined) {
    return response.data
  } else {
    return null
  }
}
export const getDictData = (url?: string, search?: string, query?: string, methods?: string, dictParam?: string) => {
  if (search) {
    // console.log(search, '2222')
    return reqP(url, query)
  } else {
    return req(url, methods === undefined ? 'get' : methods, dictParam === undefined ? {} : dictParam)
  }
}
