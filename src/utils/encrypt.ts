import { Base64 } from 'js-base64'

export function encrypt(jsonObj: any, url: string) {
  if (!jsonObj) {
    return jsonObj
  }

  if (typeof jsonObj === 'number') {
    jsonObj = '' + jsonObj
  }

  if (jsonObj instanceof Object) {
    const jsonStr = JSON.stringify(jsonObj)
    const oneStep = getOneStepData(jsonStr)
    const twoStep = getTwoStepData(jsonStr)

    const data = oneStep + twoStep
    return data
  } else if (typeof jsonObj === 'string') {
    const oneStep = getOneStepData(jsonObj)
    const twoStep = getTwoStepData(jsonObj)
    const data = oneStep + twoStep
    return data
  } else {
    throw new Error('该数据不适合加密' + url)
  }
}

function getOneStepData(jsonStr: string) {
  let len = jsonStr.length.toString()
  const lenNumber = len.length

  for (let i = 10 - lenNumber; i > 0; i--) {
    len = '0' + len
  }

  return len
}

function getTwoStepData(jsonStr: any) {
  const value = Base64.encode(jsonStr)
  const valueArray = value.split('')

  for (let i = 0; i < Math.floor(jsonStr.length / 100 + 1); i++) {
    valueArray.splice(100 * i + 1, 0, String(Math.floor(Math.random() * 10))) //splice接收的是字符串
  }

  return valueArray.join('')
}

export function decrypt(jsonStr: any) {
  if (!jsonStr) {
    return jsonStr
  }
  // console.log('xx',jsonStr)
  const orignStrLen = Number(jsonStr.substr(0, 10))
  const value1 = jsonStr.substr(10)
  const value2 = value1.split('')

  let t = 0
  for (let i = 0; i < Math.floor(orignStrLen / 100) + 1; i++) {
    value2.splice(100 * i + 1 - t, 1)
    t++
  }

  const val1 = Base64.decode(value2.join(''))
  let val2 = ''
  if (val1.startsWith('{') || val1.startsWith('[')) {
    val2 = JSON.parse(val1)
  } else if (val1.startsWith('"')) {
    val2 = val1.substring(1, val1.length - 1)
  } else {
    val2 = val1
  }
  return val2
}
