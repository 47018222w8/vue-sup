<template>
  <div id="app">
    <loading :show="isLoading"></loading>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <tabbar v-show="$route.meta.showTabbar" class="tabbar">
      <tabbar-item :selected="homeTabBar" link="/home/quote/list">
        <i slot="icon" class="fa fa-rocket"></i>
        <span slot="label">报价</span>
      </tabbar-item>
      <tabbar-item :selected="changeTabBar('orders')" link="/orders">
        <i slot="icon" class="fa fa-navicon"></i>
        <span slot="label">订单管理</span>
      </tabbar-item>
      <tabbar-item :selected="changeTabBar('shop')" link="/shop">
        <i slot="icon" class="fa fa-file-text"></i>
        <span slot="label">门店管理</span>
      </tabbar-item>
      <tabbar-item :selected="changeTabBar('setting')" link="/setting">
        <i slot="icon" class="fa fa-cog"></i>
        <span slot="label">设置</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Loading, Tabbar, TabbarItem } from 'vux'
import { mapState } from 'vuex'
export default {
  name: 'app',
  components: {
    Loading,
    Tabbar,
    TabbarItem
  },
  data() {
    return {
      showMenus: false
    }
  },
  computed: {
    ...mapState(['isLoading']),
    homeTabBar() {
      if (this.$route.name === 'quoteList' || this.$route.name === 'quoteHistory') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    selectedTabBar(str) {
      return this.$route.name === str
    },
    changeTabBar(name) {
      return this.$route.name === name
    }
  }
}
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";
@import "~vux/src/styles/1px.less";
@import "./styles/sup.less";
.tabbar {
  .fa {
    font-size: 18px;
  }
  .weui-tabbar__icon {
    height: 20px;
  }
  p {
    padding: 0;
  }
}
</style>