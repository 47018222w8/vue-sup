<template>
  <div class="c-part-list">
    <p v-show="this.quoteList.length" class="c-refresh">
      上拉刷新
    </p>
    <scroll :listenScroll="true" @scroll="listenScroll" ref="sc" :pullup="true" :pulldown="true" @pulldown="refresh" @scrollToEnd="loadMore" v-show="tabIndex===0" :data="quoteList" class="quote-list">
      <div>
        <swipeout>
          <swipeout-item v-for="(quote, index) in quoteList" :key="index" transition-mode="follow">
            <div slot="content" class="vux-1px-t" @click="toQuotePage(index)">
              <div class="c-swipeout-item-title">
                <p v-if="!quote.isRead">
                  <badge></badge>
                  <span class="s-second-title">{{quote.entMemberName}}</span>
                </p>
                <p style="padding-left:10px;" v-else>
                  <span class="s-second-title">{{quote.entMemberName}}</span>
                </p>
                <p class="s-p-desc">待报价</p>
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
</template>
<script>
import { LoadMore, Divider, XHeader, Swipeout, SwipeoutItem, SwipeoutButton, Badge } from 'vux'
import { QUOTE_LIST_KEEP_ALIVE, HOME_TAB_INDEX } from '@/store/mutation-type'
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
    Badge
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
      toTopShow: false
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
    this.$store.commit(HOME_TAB_INDEX, { index: 0 })
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
    listenScroll(pos) {
      if (pos.y < -100 && !this.toTopShow) {
        this.toTopShow = true
      }
      if (pos.y >= -100 && this.toTopShow) {
        this.toTopShow = false
      }
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
  .fa-arrow-circle-o-up {
    position: absolute;
    right: 10px;
    z-index: 200;
    color: #666;
    bottom: @s-footer-height + 10px;
    .s-opacity-0to1(2s)
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