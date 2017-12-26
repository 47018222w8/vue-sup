<template>
  <div>
    <msg title="服务器错误,请联系管理员" icon="warn">
      <x-button type="default" slot="buttons" @click.native="toHome">确认</x-button>
    </msg>
  </div>
</template>

<script>
  import { Msg, Divider, XButton } from 'vux'
  import { CHANGE_LOADING, QUOTE_LIST_KEEP_ALIVE } from '@/store/mutation-type'
  import { JWT_HEADER } from '@/components/constant'
  export default {
    components: {
      Msg,
      XButton,
      Divider
    },
    created() {
      this.$vux.loading.hide()
      this.$store.commit(CHANGE_LOADING, { isLoading: false })
      this.$store.commit(QUOTE_LIST_KEEP_ALIVE, { keepAlive: false })
    },
    data() {
      return {
      }
    },
    methods: {
      toHome() {
        let str = localStorage.getItem(JWT_HEADER)
        str ? this.$router.push({ name: 'quoteList' }) : this.$router.push({ name: 'login' })
      }
    }
  }
</script>

<style lang="less">

</style>