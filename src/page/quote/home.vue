<template>
  <div class="c-home">
    <x-header :left-options="{showBack:false}" :right-options="{showMore:false}" @on-click-more="showMenus = true" title="报价">
      <div style="margin-top: 5px;" slot="overwrite-title">
        <button-tab v-model="tabIndex">
          <button-tab-item @on-item-click="changeTab" selected>新询价单</button-tab-item>
          <button-tab-item @on-item-click="changeTab">历史询价单</button-tab-item>
        </button-tab>
      </div>
      <div v-show="tabIndex===1" @click="screen" slot="right">
        <p>筛选</p>
      </div>
    </x-header>
    <router-view></router-view>
  </div>
</template>

<script>
import { XHeader, XButton, ButtonTab, ButtonTabItem, Tabbar, TabbarItem } from 'vux'
export default {
  data() {
    return {
      insId: 2594,
      tabIndex: 0
    }
  },
  created() {
  },
  beforeRouteLeave (to, from, next) {
    this.tabIndex = 0
    next()
  },
  methods: {
    changeTab(index) {
      this.tabIndex === 0 && this.$router.push({ name: 'quoteList' })
      this.tabIndex === 1 && this.$router.push({ name: 'quoteHistory' })
    },
    screen() {
      this.$router.push({ name: 'screen' })
    }
  },
  components: {
    scroll,
    XHeader,
    XButton,
    ButtonTab,
    ButtonTabItem,
    Tabbar,
    TabbarItem
  }
}
</script>

<style lang="less">
@import "../../styles/sup.less";
</style>