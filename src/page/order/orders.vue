<template>
  <div class="c-order">
    <tab defaultColor="#666" bar-active-color="#fff" active-color="#fff">
      <tab-item :selected="tabIndex===0" @on-item-click="changTab">新订单</tab-item>
      <tab-item :selected="tabIndex===1" @on-item-click="changTab">待发货</tab-item>
      <tab-item :selected="tabIndex===2" @on-item-click="changTab">已发货</tab-item>
      <tab-item :selected="tabIndex===3" @on-item-click="changTab">已完成</tab-item>
      <tab-item :selected="tabIndex===4" @on-item-click="changTab">全部</tab-item>
    </tab>
    <div class="c-part-list">
      <scroll :pullup="true" @scrollToEnd="loadMore" :data="quoteList" class="quote-list">
        <div>
          <p v-show="tabIndex===0" class="s-second-title">您尚有{{total}}张新订单待备货</p>
          <p v-show="tabIndex===1" class="s-second-title">您有{{total}}张订单待发货</p>
          <p v-show="tabIndex===2" class="s-second-title">您有{{total}}张订单已发货</p>
          <p v-show="tabIndex===3" class="s-second-title">您有{{total}}张订单已完成</p>
          <p v-show="tabIndex===4" class="s-second-title">您共有{{total}}张订单</p>
          <swipeout>
            <swipeout-item v-for="(quote, index) in quoteList" :key="index" transition-mode="follow">
              <div slot="content" class="vux-1px-t" @click="toOrderPage(quote)">
                <div class="c-swipeout-item-title">
                  <p style="padding-left:10px;">
                    <span class="s-second-title">{{quote.repairName}}</span>
                  </p>
                  <p class="s-p-desc">{{showStr}}</p>
                </div>
                <div class="c-swipeout-item-desc">
                  <div class="c-left">
                    <img slot="icon" width="40" :src="quote.brandLogo">
                  </div>
                  <div class="c-middle">
                    <p>{{quote.carMark}}</p>
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
  import { CHANGE_ORDER_TAB_INDEX } from '@/store/mutation-type'
  export default {
    data() {
      return {
        titleIndex: 0,
        quoteList: [],
        tabIndex: 0,
        loadingMore: false,
        maxPage: 1,
        total: 0,
        // 请求参数
        params: {
          pageNum: 1,
          pageSize: 10,
          orderSource: 1,
          reportState: 2,
          listType: 'new'
        }
      }
    },
    created() {
      this.changTab(this.$store.state.orderTabIndex)
    },
    computed: {
      tipShow() {
        if (this.loadingMore) {
          return '加载中'
        }
        if (!this.loadingMore && !this.quoteList.length) {
          return '暂无数据'
        }
        if (this.params.pageNum > this.maxPage) {
          return '没有更多数据了'
        }
        if (!this.loadingMore && this.quoteList.length) {
          return '下拉刷新'
        }
      },
      showStr() {
        let str = ''
        switch (this.tabIndex) {
          // 待发货
          case 1:
            str = '待发货'
            break
          // 已发货
          case 2:
            str = '已发货'
            break
          // 已完成
          case 3:
            str = '已完成'
            break
          // 全部
          case 4:
            str = '全部'
            break
          // 新订单
          default:
            str = '待备货'
        }
        return str
      }
    },
    methods: {
      async _initData() {
        if (this.params.pageNum <= this.maxPage) {
          this.loadingMore = true
          let params = this.params
          await this.$http.get('/orders', { params }).then((response) => {
            this.quoteList.push(...response.data.orders)
            this.total = response.data.totalCount
            this.maxPage = Math.ceil(this.total / this.params.pageSize)
            this.params.pageNum++
          })
          this.loadingMore = false
        }
      },
      toOrderPage(item) {
        if (item.orderState === '0') {
          this.$router.push('/orders/' + item.insId + '/send?mainSn=' + item.mainSn + '&insOrderId=' + item.tinsId + '&sonSn=' + item.sonSn)
        } else {
          this.$router.push('/orders/' + item.insId + '?sonSn=' + item.sonSn + '&orderState=' + item.orderState)
        }
      },
      changeTitle() {
      },
      screen() {
        this.$router.push({ name: 'screen' })
      },
      changTab(index) {
        this.tabIndex = index
        this.$store.commit(CHANGE_ORDER_TAB_INDEX, { tabIndex: this.tabIndex })
        switch (index) {
          // 待发货
          case 1:
            this.params.pageNum = 1
            this.maxPage = 1
            this.quoteList = []
            this.params.listType = 'waitShip'
            this._initData()
            break
          // 已发货
          case 2:
            this.params.pageNum = 1
            this.maxPage = 1
            this.quoteList = []
            this.params.listType = 'shipping'
            this._initData()
            break
          // 已完成
          case 3:
            this.params.pageNum = 1
            this.maxPage = 1
            this.quoteList = []
            this.params.listType = 'done'
            this._initData()
            break
          // 全部
          case 4:
            this.params.pageNum = 1
            this.maxPage = 1
            this.quoteList = []
            this.params.listType = 'all'
            this._initData()
            break
          // 新订单
          default: 0
            this.params.pageNum = 1
            this.maxPage = 1
            this.params.listType = 'new'
            this.quoteList = []
            this._initData()
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
.c-order {
  .vux-tab {
    background-color: @s-primary-color;
  }
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
      max-height: calc(~"100vh - @{s-footer-height} - @{vux-tab-height}");
      overflow: hidden;
    }
  }
}
</style>