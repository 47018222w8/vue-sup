<template>
  <div id="app">
    <s-header v-show="showHeader" :title="'找件儿'">车益佰找件</s-header>
    <div v-show="showHeader" style="padding-top: 40px;"></div>
    <router-view></router-view>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, XHeader } from 'vux'
import sHeader from './components/header'
export default {
  name: 'app',
  components: {
    XHeader,
    Tabbar,
    TabbarItem,
    sHeader
  },
  computed: {
    showHeader() {
      return this.$route.name !== 'login'
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import './styles/sup.less';
</style>