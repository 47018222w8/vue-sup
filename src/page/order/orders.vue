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
      <p class="s-first-title">您尚有9张询价单未处理</p>
      <scroll :pullup="true" @scrollToEnd="loadMore" v-show="tabIndex===0" :data="quoteList" class="quote-list">
        <div>
          <swipeout>
            <swipeout-item v-for="(quote, index) in quoteList" :key="index" transition-mode="follow">
              <div slot="content" class="vux-1px-t" @click="toOrderPage(quote.id)">
                <div class="c-swipeout-item-title">
                  <p v-if="!quote.isRead">
                    <badge></badge>
                    <span style="font-weight:700;font-size:16px;">{{quote.entMemberName}}</span>
                  </p>
                  <p style="padding-left:10px;" v-else>
                    <span style="font-weight:700;font-size:16px;">{{quote.entMemberName}}</span>
                  </p>
                  <p class="s-p-desc">待备货</p>
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
                    <x-icon type="ios-arrow-right" size="30"></x-icon>
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
      // 下一页
      pageNum: 1,
      tabIndex: 0,
      loadingMore: false,
      notReadCount: 0,
      maxPage: 1,
      formData: {
        insNo: '',
        beginDate: '',
        endDate: ''
      }
    }
  },
  created() {
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
      if (this.pageNum > this.maxPage) {
        return '没有更多数据了'
      }
      if (!this.loadingMore && this.quoteList.length) {
        return '下拉刷新'
      }
    }
  },
  methods: {
    async _initData() {
      if (this.pageNum <= this.maxPage) {
        this.loadingMore = true
        let params = {
          pageNum: this.pageNum,
          pageSize: 10,
          reportState: 2,
          insReportStatesStr: '10',
          mark: 1,
          isRead: 0
        }
        await this.$http.get('/insruances', { params }).then((response) => {
          this.quoteList.push(...response.data.insurancePage.list)
          this.notReadCount = response.data.notReadCount
          this.maxPage = response.data.insurancePage.pages
          this.pageNum++
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
      console.log(index)
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