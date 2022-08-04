<template>
  <span>
    <span v-if="isFailure === false" :class="className">{{ showName }}</span>
    <span style="color: #5babfb; cursor: pointer" v-if="isFailure === true" :class="className" @click="Failure">{{ showName }}</span>
  </span>
</template>
<script lang="ts" setup>
import { getDictData } from '@/api/keyValue/keyValue'
import { setStore, getStore, removeStore } from '@/utils/store'
type dictUrlType = {
  data: string
  label: string
  value: string
}
interface Props {
  value: string
  defaultValue: string
  dictUrl: string
  dictProp: dictUrlType
  className: string
  isFailure: boolean
}
const props = withDefaults(defineProps<Props>(), {
  // 不能使用 value关键字
  value2: '',
  defaultValue: '/',
  dictUrl: '',
  dictProp: () => {
    return {
      data: 'result',
      label: 'dictValue',
      value: 'dictKey',
    }
  },
  className: '',
  isFailure: false,
})
let showName = ref('')
let dictType = ref('')
let currentValue = ref('')
watch(props.value2, (_newValue, _oldValue) => {
  if (!props.value && props.value != '0') {
    showName.value = ''
  } else if (currentValue.value !== props.value) {
    currentValue.value = props.value
    getDictDataAction(props.dictUrl)
  }
})
const getDictDataAction = async (dictUrl: string) => {
  // 增加确认是否已经有数据加载
  const loadingFlag = getStore({ name: props.dictUrl + '-loadingFlag', type: 'session' })
  // 如果不为空 则说明已经有其他地方正在请求数据，则当前线程等待请求
  if (loadingFlag !== undefined || (loadingFlag !== undefined && loadingFlag !== '')) {
    for (let i = 1; i < 10; i++) {
      await wait(0.1)
      // 加载历史数据
      const result = getStore({ name: dictUrl, type: 'session' })

      if (result !== undefined && result.time > new Date().getTime()) {
        loadToView(dictUrl, result.data)
        return
      }
    }
  }

  // 加载历史数据
  let result = getStore({ name: dictUrl, type: 'session' })

  if (result !== undefined && result.time > new Date().getTime()) {
    loadToView(dictUrl, result.data)
    return
  }

  setStore({ name: dictUrl + '-loadingFlag', content: 'loading', type: 'session' })
  const dictData = await getDictData(dictUrl)
  const realData = []
  if (getResultIsReady(dictData, props.dictProp.data) !== undefined) {
    const temp: any = getResultIsReady(dictData, props.dictProp.data)
    for (const index in temp) {
      const item = temp[index]
      realData.push({
        label: item[props.dictProp.label],
        value: item[props.dictProp.value],
      })
    }
  }
  result = {}
  result.data = realData
  result.time = new Date().getTime() + 5 * 60 * 1000
  setStore({
    name: dictUrl,
    content: result,
    type: 'session',
  })
  loadToView(dictUrl, result.data)

  // 完成业务后删除flag
  setStore({ name: dictUrl + '-loadingFlag', content: '', type: 'session' })
  removeStore({ name: dictUrl + '-loadingFlag', type: 'session' })
}
const wait = (numberMillis: number) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, numberMillis * 1000)
  })
}
const loadToView = (dictUrl: string, dictData: any) => {
  let result = getStore({ name: dictUrl + props.value, type: 'session' })
  console.log(JSON.stringify(dictData) + dictUrl + props.value)
  if (result !== undefined && result.time > new Date().getTime()) {
    // console.log(result.data, '2222')
    showName = result.data
  } else {
    let tempShow = ''
    if (dictData.length > 0) {
      if (dictType.value === undefined) {
        dictType.value = typeof dictData[0].value
      }
      // eslint-disable-next-line
      if (dictType.value !== typeof currentValue.value) {
        switch (dictType.value) {
          case 'string':
            currentValue.value = props.value.toString()
            break
          case 'number': {
            const aTemp = parseInt(currentValue.value)
            currentValue.value = isNaN(aTemp) ? 'def' : aTemp.toString()
          }
        }
      }
    }

    for (const index in dictData) {
      const item = dictData[index]
      if (item.value === props.value) {
        tempShow = item.label
      }
    }

    if (tempShow === '') {
      tempShow = props.value
    }
    result = {}
    result.data = tempShow
    result.time = new Date().getTime() + 5 * 60 * 1000
    setStore({
      name: dictUrl + props.value,
      content: result,
      type: 'session',
    })
    showName = result.data
  }
  // console.log(this.showName, '333333')
}
const getResultIsReady = (dictData: string, dataProp: string) => {
  const resultDir: any[] = dataProp.split('.')
  let temp = dictData
  resultDir.forEach((element) => {
    if (temp[element] !== undefined) {
      temp = temp[element]
    }
  })
  if (temp !== undefined) {
    return temp
  }
}
// 触发父组件方法

const emit = defineEmits(['Failure'])
const Failure = () => {
  //传递给父组件
  emit('Failure')
}
</script>
