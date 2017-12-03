<template>
  <div>
    <msg title="服务器错误,请联系管理员" icon="warn" :buttons="buttons"></msg>
  </div>
</template>

<script>
import { Msg, Divider, XButton } from 'vux'
export default {
  components: {
    Msg,
    XButton,
    Divider
  },
  data() {
    return {
      buttons: [{
        type: 'default',
        text: '返回首页',
        link: '/home/quote/list'
      }]
    }
  }
}
</script>

<style lang="less">

</style>