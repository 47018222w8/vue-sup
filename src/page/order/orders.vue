<template>
  <div class="c-order">
    <x-header :left-options="{showBack:false}" :right-options="{showMore:false}" @on-click-more="showMenus = true">
      <div style="margin-top: 5px;" slot="overwrite-title">
        <button-tab v-model="titleIndex">
          <button-tab-item @on-item-click="changeTitle">近两天</button-tab-item>
          <button-tab-item @on-item-click="changeTitle">选择日期</button-tab-item>
        </button-tab>
      </div>
    </x-header>
    <tab>
      <tab-item selected @on-item-click="changTab">新订单</tab-item>
      <tab-item @on-item-click="changTab">待配送</tab-item>
      <tab-item @on-item-click="changTab">配送中</tab-item>
      <tab-item @on-item-click="changTab">已完成</tab-item>
      <tab-item @on-item-click="changTab">全部</tab-item>
    </tab>
    <div class="c-part-list">
      <p v-show="tabIndex===0" class="s-second-title">您尚有{{total}}张新订单待备货</p>
      <p v-show="tabIndex===2" class="s-second-title">您有{{total}}张订单在配送中</p>
      <p v-show="tabIndex===3" class="s-second-title">您有{{total}}张订单已完成</p>
      <scroll :pullup="true" @scrollToEnd="loadMore" :data="quoteList" class="quote-list">
        <div>
          <swipeout>
            <swipeout-item v-for="(quote, index) in quoteList" :key="index" transition-mode="follow">
              <div slot="content" class="vux-1px-t" @click="toOrderPage(quote.id)">
                <div class="c-swipeout-item-title">
                  <p style="padding-left:10px;">
                    <span class="s-second-title">{{quote.repairName}}</span>
                  </p>
                  <p class="s-p-desc">待备货</p>
                </div>
                <div class="c-swipeout-item-desc">
                  <div class="c-left">
                    <img slot="icon" width="40" :src="quote.brandLogo">
                  </div>
                  <div class="c-middle">
                    <p>{{quote.carName}}</p>
                    <p>{{quote.partCount}}个零件</p>
                    <p class="s-p-desc">{{quote.askTimeStr}}</p>
                  </div>
                  <div class="c-right">
                    <x-icon type="ios-arrow-right" size="20"></x-icon>
                  </div>
                </div>
              </div>
            </swipeout-item>
          </swipeout>
          <load-more :show-loading="loadingMore" :tip="tipShow" background-color="#fbf9fe"></load-more>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
  import { XHeader, XButton, ButtonTab, ButtonTabItem, Tabbar, TabbarItem, Tab, TabItem, Swipeout, SwipeoutItem, LoadMore, Badge } from 'vux'
  import scroll from '@/components/scroll'
  export default {
    data() {
      return {
        titleIndex: 0,
        quoteList: [],
        tabIndex: 0,
        loadingMore: false,
        notReadCount: 0,
        maxPage: 1,
        total: 0,
        // 请求参数
        params: {
          pageNum: 1,
          pageSize: 10
        },
        // 请求url
        url: '/orders'
      }
    },
    created() {
      this.params.reportState = 2
      this._initData()
    },
    computed: {
      tipShow() {
        if (this.loadingMore) {
          return '加载中'
        }
        if (!this.loadingMore && !this.quoteList.length) {
          return '暂无询价'
        }
        if (this.params.pageNum > this.maxPage) {
          return '没有更多数据了'
        }
        if (!this.loadingMore && this.quoteList.length) {
          return '下拉刷新'
        }
      }
    },
    methods: {
      async _initData() {
        if (this.params.pageNum <= this.maxPage) {
          this.loadingMore = true
          let params = this.params
          await this.$http.get('/orders', { params }).then((response) => {
            this.quoteList.push(...response.data.insurancePage.list)
            this.notReadCount = response.data.notReadCount
            this.maxPage = response.data.insurancePage.pages
            this.total = response.data.insurancePage.total
            this.params.pageNum++
          })
          this.loadingMore = false
        }
      },
      toOrderPage(insId) {
        this.$router.push({ name: 'order', params: { insId: insId } })
      },
      changeTitle() {
      },
      screen() {
        this.$router.push({ name: 'screen' })
      },
      changTab(index) {
        this.tabIndex = index
        switch (index) {
          // 配送中
          case 2:
            this.url = '/orders'
            this.params.pageNum = 1
            this.params.reportState = 3
            this.params.status = null
            this.quoteList = []
            this._initData()
            break
          // 已完成
          case 3:
            this.url = '/orders/done'
            this.params.pageNum = 1
            this.params.reportState = null
            this.params.status = '7'
            this.quoteList = []
            this._initData()
            break
          // 新订单
          default: 0
            this.url = '/orders'
            this.params.pageNum = 1
            this.params.reportState = 2
            this.params.status = null
            this.quoteList = []
            this._initData()
            break
        }
      },
      loadMore() {
        this._initData()
      }
    },
    components: {
      scroll,
      XHeader,
      XButton,
      ButtonTab,
      ButtonTabItem,
      Tabbar,
      TabbarItem,
      Tab,
      TabItem,
      Swipeout,
      SwipeoutItem,
      LoadMore,
      Badge
    }
  }
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-part-list {
  .display-flex;
  .flex-direction(column);
  padding: 0 12px 0 12px;
  background-color: #fff;
  overflow: hidden;
  .c-cell {
    .flex(none);
  }
  .quote-list {
    p {
      padding: 0;
    }
    .display-flex;
    .flex(none);
    .flex-direction(column);
    .c-swipeout-item-title {
      .display-flex;
      .justify-content(space-between);
      .align-items(center);
      height: 44px;
    }
    .c-swipeout-item-desc {
      .display-flex;
      .c-left {
        .flex(0 0 15%);
      }
      .c-middle {
        .flex(auto);
      }
      .c-right {
        .flex(0 0 5%);
        .display-flex;
        .align-items(center);
        .justify-content(space-between);
        .vux-x-icon {
          fill: @s-desc-font-color;
        }
      }
    }
    max-height: calc(
      ~"100vh - @{vux-header-height} - @{s-footer-height} - @{vux-tab-height} - 38px"
    );
    overflow: hidden;
  }
}
</style>