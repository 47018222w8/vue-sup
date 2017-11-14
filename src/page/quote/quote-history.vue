<template>
  <div class="c-part-list">
    <scroll :pullup="true" @scrollToEnd="loadMore" v-show="tabIndex===0" :data="quoteList" class="quote-list">
      <div>
        <swipeout>
          <swipeout-item v-for="(quote, index) in quoteList" :key="index" transition-mode="follow">
            <div slot="right-menu">
              <swipeout-button type="primary">是的</swipeout-button>
              <swipeout-button type="warn">不是</swipeout-button>
            </div>
            <div slot="content" class="vux-1px-t">
              <div class="c-swipeout-item-title">
                <p>zxczxczxczxczxczxc【吉A12345】</p>
                <p class="s-p-desc">状态</p>
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
</template>
<script>
import { LoadMore, Divider, Cell, Group, Tab, TabItem, XHeader, Swipeout, SwipeoutItem, SwipeoutButton, Datetime, XInput } from 'vux'
import { QUOTE_LIST_KEEP_ALIVE } from '@/store/mutation-type'
import scroll from '@/components/scroll'
export default {
  name: 'quoteList',
  components: {
    Cell,
    Group,
    Tab,
    TabItem,
    scroll,
    Divider,
    LoadMore,
    XHeader,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Datetime,
    XInput
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
      }
    }
  },
  // 即便缓存此组件,也可以被加载
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 此时说明需要从新加载组件
      if (!vm.$store.state.quoteListKeepAlive) {
        vm._initParam()
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
          reportState: 0,
          insReportStatesStr: '1,2',
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
    _initParam() {
      this.pageNum = 1
      this.maxPage = 1
      this.quoteList = []
    },
    // 筛选
    screen() {
      this.tabIndex = 1
    },
    toQuotePage(index) {
      if (!this.quoteList[index].isRead) {
        let rpe = {
          insId: this.quoteList[index].id,
          isRead: 1
        }
        this.$http.put('/reportPriceExtends', rpe).then((response) => {
          this.$router.push({
            name: 'quote',
            params: {
              insId: this.quoteList[index].id
            }
          })
        })
      } else {
        this.$router.push({
          name: 'quote',
          params: {
            insId: this.quoteList[index].id
          }
        })
      }
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
    max-height: calc(~"100vh - @{vux-header-height} - @{s-footer-height}");
    overflow: hidden;
  }
}
</style>