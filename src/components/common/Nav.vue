<template>
  <div ref="nav" class="nav" :style="environment.isFengChao ? { 'background-color': '#008BFF', color: '#ffffff' } : { boxShadow: '0 2px 3px #eaeaea' }">
    <div class="nav-left">
      <div class="back-area" id="back">
        <div v-if="!showIndex" style="font-size: 16px" @click="back">
          <i class="edu fanhui"></i>
        </div>
        <div v-if="showClose && environment.isFengChao" style="font-size: 23px" @click.stop="close">
          <i class="edu guanbi"></i>
        </div>
      </div>
    </div>
    <div class="nav-middle">
      <span class="title">{{ cpTitle }}</span>
    </div>
    <div class="nav-right">
      <slot>
        <div class="nav-right-content" @click="rightBtn">
          <span class="click-size">{{ btnText }}</span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getStore } from '@/utils/store.js'
const router = useRouter()
const isEmpty: any = inject('isEmpty')
const environment: any = inject('environment')
type moduleDetailsType = {
  stepTitle: string
  [key: string]: any
}
let cpTitle = ref('')
let moduleDetails: moduleDetailsType
const emit = defineEmits(['back', 'close', 'rightBtn'])
interface Props { //不一定会传的值最好加上？多类型判断
  title?: string
  btnText?: string
  showClose?: boolean
  showIndex?: boolean
  isNeedBackEvent?: boolean
  isNeedCloseEvent?: boolean
  closeEvent?: any
}
const props = withDefaults(defineProps<Props>(), {
  title: '',
  btnText: '',
  showClose: true,
  showIndex: false,
  isNeedBackEvent: false,
  isNeedCloseEvent: false,
  closeEvent: null,
})
watch(
  () => props.title,
  (_newValue, _oldValue) => {
    cpTitle.value = props.title
  }
)
onMounted(() => {
  const moduleDetails2 = getStore({
    name: 'online_moduleInfo_details',
    type: 'session',
  })
  if (moduleDetails2) {
    moduleDetails = moduleDetails2
    cpTitle.value = moduleDetails.stepTitle
    return
  }
  cpTitle.value = props.title
  if (!isEmpty(props.title)) {
    document.title = props.title
  }
})
const back = () => {
  console.log(111);
  
  if (props.isNeedBackEvent) {
    emit('back')
  } else {
    router.go(-1)
  }
}
const rightBtn = () => {
  emit('rightBtn')
}
const close = async () => {
  if (props.isNeedCloseEvent) {
    emit('close')
    return
  }
  if (props.closeEvent) {
    await props.closeEvent()
  }
  if (environment.isFengChao) {
    window.jsApi.closeWebView()
  } else if (environment.isWeChat) {
    window.history.back()
  } else if (environment.isMobileWeb) {
    // H5
    router.replace({
      path: '/login',
      query: {
        logout: 'true',
      },
    })
  } else {
    // PC
    if (navigator.userAgent.indexOf('Firefox') !== -1 || navigator.userAgent.indexOf('Chrome') !== -1) {
      window.location.href = 'about:blank'
      window.close()
    } else {
      window.opener = null
      window.open('', '_self')
      window.close()
    }
  }
}
</script>

<style lang="scss">
$navColor: #ffffff; //nav背景颜色
$navTextColor: #4a4a4a; // nav字体颜色
$navHeight: 50px; // nav高度
.nav {
  user-select: none;
  width: 100%;
  height: 50px;
  background-color: $navColor;
  color: $navTextColor;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  // box-shadow: 0 2px 3px #eaeaea;
  .click-size.size {
    font-size: 15px;
  }
  .title {
    // font-weight: bold;
    font-size: 17px;
    // letter-spacing: 2px;
  }
  i {
    // width: 18px;
    // height: 18px;
    vertical-align: middle;
    font-size: 18px;
  }
}
.nav-left {
  user-select: none;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 24%;
  span {
    margin-right: 5px;
  }
}
.nav-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 24%;
  height: $navHeight;
  .nav-right-text {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 65px;
    height: $navHeight;
    // &:active {
    //   background-color: $navColor;
    // }
  }
  .nav-right-content {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    align-self: flex-end;
    width: 100%;
    height: $navHeight;
    margin-right: 10px;
    img {
      width: 25px;
    }
  }
}
.back-area {
  height: $navHeight;
  //   width: 80%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 15px;
  cursor: pointer;
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    height: $navHeight;
    margin-right: 10px;
  }
  // &:active {
  //   background-color: $navColor;
  // }
  .text {
    color: #0093dd;
    font-size: 15px;
  }
}
.back-img {
  overflow: hidden;
  img {
    height: 18px !important;
  }
}
.information-img {
  height: 18px !important;
  margin-right: 2px;
}
</style>
