<template>
  <div class="c-part-list">
    <x-header :left-options="{showBack:false}" :right-options="{showMore:false}" @on-click-more="showMenus = true" title="找件儿"></x-header>
    <scroll :pullup="true" @scrollToEnd="loadMore" v-show="tabIndex===0" :data="quoteList" class="quote-list">
      <div>
        <group gutter="0" v-for="(quote, index) in quoteList" :key="index">
          <cell is-link @click.native="toQuotePage(index)" :title="quote.carMark" :inline-desc="quote.partName+'等'+quote.partCount+'个零件'+quote.askTimeStr">
            <img slot="icon" width="30" style="display:block;margin-right:5px;" :src="quote.brandLogo">
            <badge v-if="quote.isRead===0"></badge>
          </cell>
        </group>
        <load-more :show-loading="loadingMore" :tip="tipShow" background-color="#fbf9fe"></load-more>
      </div>
    </scroll>
    <s-footer></s-footer>
    <!-- <div v-transfer-dom>
      <actionsheet on-click-menu="clickMenu" :menus="xHeaderData.menus" v-model="showMenus" show-cancel></actionsheet>
    </div> -->
  </div>
</template>
<script>
import { LoadMore, Divider, Cell, Group, Tab, TabItem, Badge, Actionsheet, TransferDom, XHeader } from 'vux'
import sFooter from '../components/footer'
import scroll from '../components/scroll'
export default {
  name: 'quoteList',
  directives: {
    TransferDom
  },
  components: {
    Cell,
    Group,
    Tab,
    TabItem,
    scroll,
    Divider,
    LoadMore,
    Badge,
    sFooter,
    Actionsheet,
    XHeader
  },
  data() {
    return {
      menus: {
        menu1: 'Take Photo',
        menu2: 'Choose from photos'
      },
      showMenus: false,
      quoteList: [],
      pageNum: 1,
      refreshing: false,
      tabIndex: 0,
      loadingMore: false,
      notReadCount: 0,
      maxPage: 0
    }
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
      this.pageNum <= this.maxPage && this._initData()
    }
  }
}
</script>

<style scoped lang="less">
@import '../styles/sup.less';
.c-part-list {
  .display-flex;
  .flex-direction(column);
  overflow: hidden;
  .c-cell {
    .flex(none);
  }
  .quote-list {
    .display-flex;
    .flex(none);
    .flex-direction(column);
    max-height: calc(~"100vh - @{vux-header-height} - @{s-footer-height}");
    overflow: hidden;
  }
}
</style>