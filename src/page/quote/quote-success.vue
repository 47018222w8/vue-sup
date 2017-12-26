<template>
  <div>
    <x-header :left-options="{preventGoBack:true,showBack:false}" :right-options="{showMore:false}" @on-click-more="showMenus = true" title="报价">
       <div slot="left" @click="back">
        <i slot="icon" class="fa fa-times fa-lg"></i>
      </div>
    </x-header>
    <msg icon="success" title="报价成功!">
      <x-button type="default" slot="buttons" @click.native="back">继续报价</x-button>
    </msg>
  </div>
</template>

<script>
  import { Msg, XButton, XHeader } from 'vux'
  import { QUOTE_LIST_KEEP_ALIVE } from '@/store/mutation-type'
  export default {
    components: {
      Msg,
      XButton,
      XHeader
    },
    data() {
      return {
      }
    },
    created() {
    },
    methods: {
      back() {
        this.$store.commit(QUOTE_LIST_KEEP_ALIVE, { keepAlive: false })
        this.$router.push({ name: 'quoteList' })
      }
    }
  }
</script>

<style lang="less">

</style>