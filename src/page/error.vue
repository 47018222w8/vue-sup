<template>
  <div class="c-home">
    <s-header class="c-cell" :returnName="'quoteList'" :title="'找件儿'"></s-header>
    <p>我是错误页</p>
    <s-footer></s-footer>
  </div>
</template>

<script>
import sFooter from '../components/footer'
import sHeader from '../components/header'
import constant from '../components/constant'
export default {
  components: {
    sFooter,
    sHeader,
    constant
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