<template>
  <div class="c-part-list">
    <s-header class="c-cell" :returnName="'home'" :leftIcon="false"></s-header>
    <tab class="c-cell" active-color="#2196f3" v-model="tabIndex">
      <tab-item index="0" selected>报价
        <badge v-if="notReadCount!==0" :text="notReadCount"></badge>
      </tab-item>
      <tab-item index="1">整单</tab-item>
    </tab>
    <div class="quote-list">
      <scroll class="wrapper" :pullup="true" @scrollToEnd="loadMore" v-show="tabIndex===0" :data="quoteList" style="flex: 1;">
        <group gutter="0">
          <cell is-link v-for="(quote, index) in quoteList" :key="index" :title="quote.carMark" @click.native="toQuotePage(index)" :inline-desc="quote.partName+'等'+quote.partCount+'个零件'+quote.askTimeStr">
            <img slot="icon" width="30" style="display:block;margin-right:5px;" :src="quote.brandLogo">
            <badge v-if="quote.isRead===0"></badge>
          </cell>
          <load-more :show-loading="loadingMore" :tip="tipShow" background-color="#fbf9fe"></load-more>
        </group>
      </scroll>
    </div>
    <s-footer></s-footer>
  </div>
</template>
<script>
import { LoadMore, Divider, Cell, Group, Tab, TabItem, Badge } from 'vux'
import sHeader from '../components/header'
import sFooter from '../components/footer'
import scroll from '../components/scroll'
export default {
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
    sHeader
  },
  data() {
    return {
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
  .c-cell {
    .flex(0 0 auto);
  }
  .quote-list {
    .display-flex;
    position: absolute;
    top: 84px;
    bottom: 40px;
    width: 100%;
    overflow: hidden;
  }
}
</style>