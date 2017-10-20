<template>
  <div class="c-home">
    <s-header class="c-cell" :returnName="'quoteList'" :title="'找件儿'"></s-header>
    <p>我是首页</p>
    <s-footer></s-footer>
  </div>
</template>

<script>
import sFooter from '../components/footer'
import sHeader from '../components/header'
export default {
  components: {
    sFooter,
    sHeader
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