<template>
  <div class="home">
    <Nav :title="title"></Nav>
    <div>111</div>
    <Button @click="aa">1111</Button>
  </div>
</template>

<script lang="ts" setup>
const $Message: any = inject('$Message')
const $Spin: any = inject('$Spin')
const $Modal: any = inject('$Modal')
const title = ref<string>('')
onMounted(() => {})
const aa = () => {
  console.log($Message)
  title.value = '首页'
  $Message.error('111')
  $Spin.show()
  setTimeout(() => {
    $Spin.hide()
    $Modal.info({
      title: '1111',
      content: '33333',
    })
  }, 1000)
  // globalProperties?.$Message.error('111')
}
</script>

<style lang="scss">
.home {
  margin-top: 55px;
}
</style>
