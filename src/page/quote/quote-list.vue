<template>
  <div class="c-home">
    <x-header :left-options="{showBack:false}" :right-options="{showMore:false}" @on-click-more="showMenus = true" title="报价">
      <div style="margin-top: 5px;" slot="overwrite-title">
        <button-tab v-model="tabIndex">
          <button-tab-item @on-item-click="changeTab">新询价单</button-tab-item>
          <button-tab-item @on-item-click="changeTab">历史询价单</button-tab-item>
        </button-tab>
      </div>
      <p slot="right" @click="refresh">刷新</p>
      <div v-show="tabIndex===8" slot="right">
        <p>筛选</p>
      </div>
    </x-header>
    <div class="c-part-list">
      <p v-show="this.quoteList.length" class="c-refresh">
        上拉刷新
      </p>
      <scroll :listenScroll="true" @scroll="listenScroll" ref="sc" :pullup="true" :pulldown="true" @pulldown="refresh" @scrollToEnd="loadMore" :data="quoteList" class="quote-list">
        <div>
          <swipeout>
            <swipeout-item v-for="(quote, index) in quoteList" :key="index" transition-mode="follow">
              <div v-if="tabIndex===1" slot="right-menu">
                <swipeout-button type="warn" @click.native="del(index)">删除</swipeout-button>
              </div>
              <div slot="content" class="vux-1px-t" @click="toPage(quote.id)">
                <div class="c-swipeout-item-title">
                  <p v-if="!quote.isRead && tabIndex===0">
                    <badge></badge>
                    <span class="s-second-title">{{quote.entMemberName}}</span>
                  </p>
                  <p style="padding-left:10px;" v-else>
                    <span class="s-second-title">{{quote.entMemberName}}</span>
                  </p>
                  <p class="s-p-desc" v-if="tabIndex===0">待报价</p>
                  <p class="s-p-desc" v-if="tabIndex===1">已报价</p>
                </div>
                <div class="c-swipeout-item-desc">
                  <div class="c-left">
                    <img slot="icon" width="60" :src="quote.brandLogo">
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
      <i v-show="toTopShow" @click="toTop" class="fa fa-arrow-circle-o-up fa-2x"></i>
    </div>
  </div>
</template>
<script>
  import { XButton, ButtonTab, ButtonTabItem, LoadMore, Divider, XHeader, Swipeout, SwipeoutItem, SwipeoutButton, Badge } from 'vux'
  import { QUOTE_LIST_KEEP_ALIVE } from '@/store/mutation-type'
  import scroll from '@/components/scroll'
  export default {
    name: 'quoteList',
    components: {
      scroll,
      Divider,
      LoadMore,
      XHeader,
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      Badge,
      XButton,
      ButtonTab,
      ButtonTabItem
    },
    data() {
      return {
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
        },
        toTopShow: false,
        isHistory: 0
      }
    },
    // 即便缓存此组件,也可以被加载
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // 此时说明需要从新加载组件
        if (!vm.$store.state.quoteListKeepAlive) {
          vm._initParam()
          vm.tabIndex = 0
          vm.isHistory = 0
          vm._initData()
          vm.$store.commit(QUOTE_LIST_KEEP_ALIVE, { keepAlive: true })
        }
      })
    },
    created() {
      this._initData()
    },
    mounted() { },
    computed: {
      tipShow() {
        if (this.loadingMore) {
          return '加载中'
        }
        if (!this.loadingMore && !this.quoteList.length) {
          return '暂无询价,上拉刷新'
        }
        if (this.pageNum > this.maxPage) {
          return '没有更多数据了'
        }
        if (!this.loadingMore && this.quoteList.length) {
          return '下拉加载更多'
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
            reportState: 0,
            insReportStatesStr: '1,2',
            mark: 1,
            isRead: 0,
            isHistory: this.isHistory
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
      listenScroll(pos) {
        if (pos.y < -100 && !this.toTopShow) {
          this.toTopShow = true
        }
        if (pos.y >= -100 && this.toTopShow) {
          this.toTopShow = false
        }
      },
      changeTab() {
        this._initParam()
        this.tabIndex === 0 ? this.isHistory = 0 : this.isHistory = 1
        this._initData()
      },
      // 删除
      del(index) {
        let rpe = {
          insId: this.quoteList[index].id,
          isDel: 1
        }
        this.$http.put('/reportPriceExtends', rpe).then((response) => {
          this.quoteList.splice(index, 1)
          this.$vux.toast.text('删除成功', 'middle')
        })
      },
      // 刷新
      refresh() {
        this._initParam()
        setTimeout(() => {
          this._initData()
        }, 1000)
      },
      // 返回
      toTop() {
        this.$refs.sc.scrollTo(0, 0, 100)
      },
      _initParam() {
        this.pageNum = 1
        this.maxPage = 1
        this.quoteList = []
        this.loadingMore = true
      },
      toPage(insId) {
        this.isHistory === 0 && this.$http.put('/reportPriceExtends', { insId: insId, isRead: 1 }).then((response) => {
          this.$router.push({
            name: 'quote',
            params: {
              insId: insId
            }
          })
        })
        this.isHistory === 1 && this.$router.push({ name: 'quoteHistoryInfo', params: { insId: insId } })
      },
      loadMore() {
        this._initData()
      }
    }
  }
</script>

<style scoped lang="less">
@import "../../styles/sup.less";
.c-part-list {
  .fa-arrow-circle-o-up {
    position: absolute;
    right: 10px;
    z-index: 200;
    color: #666;
    bottom: @s-footer-height + 10px;
    .s-opacity-0to1(2s);
  }
  .c-refresh {
    position: absolute;
    top: @vux-header-height + 5px;
    margin: 0 auto;
  }
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
    max-height: calc(~"100vh - @{vux-header-height} - @{s-footer-height}");
    overflow: hidden;
  }
}
</style>