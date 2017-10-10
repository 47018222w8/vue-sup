<template>
  <div class="c-home">
    <msg title="服务器错误,请联系管理员" icon="warn" :buttons="buttons"></msg>
  </div>
</template>

<script>
import constant from '../components/constant'
import { Msg } from 'vux'
export default {
  components: {
    constant,
    Msg
  },
  data() {
    return {
      buttons: [{
        type: 'default',
        text: '返回首页',
        link: '/home'
      }]
    }
  }
}
</script>

<style lang="less">
.c-home {
  display: flex;
  flex-direction: column;
  .c-cell {
    flex: 0 0 auto;
  }
}
</style>