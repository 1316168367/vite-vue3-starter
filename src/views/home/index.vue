<template>
  <div>111</div>
  <Button @click="aa">1111</Button>
</template>

<script lang="ts" setup>
const $Message: any = inject('$Message')
const $Spin: any = inject('$Spin')
const $Modal: any = inject('$Modal')
onMounted(() => {})
const aa = () => {
  console.log($Message)
  $Message.error('111')
  $Spin.show()
  setTimeout(() => {
    $Spin.hide()
    $Modal.info({
      title:'1111',
      content:'33333'
    })
  }, 1000);
  // globalProperties?.$Message.error('111')
}
</script>

<style></style>
