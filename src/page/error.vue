<template>
  <div>
    <msg title="服务器错误,请联系管理员" icon="warn" :buttons="buttons"></msg>
  </div>
</template>

<script>
  import { Msg, Divider, XButton } from 'vux'
  import { CHANGE_LOADING } from '@/store/mutation-type'
  export default {
    components: {
      Msg,
      XButton,
      Divider
    },
    created() {
      this.$vux.loading.hide()
      this.$store.commit(CHANGE_LOADING, { isLoading: false })
    },
    data() {
      return {
        buttons: [{
          type: 'default',
          text: '返回首页',
          link: '/quote/list'
        }]
      }
    }
  }
</script>

<style lang="less">

</style>