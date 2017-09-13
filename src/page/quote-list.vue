<template>
  <div class="c-part-list">
    <s-header class="c-cell" :returnName="'home'" :title="'找件儿'"></s-header>
    <tab class="c-cell" active-color="#2196f3" v-model="tabIndex">
      <tab-item index="0" selected>报价</tab-item>
      <tab-item index="1">整单</tab-item>
    </tab>
    <div class="quote-list">
      <scroll class="wrapper" :pullup="true" @scrollToEnd="loadMore" v-show="tabIndex===0" :data="quoteList" style="flex: 1;">
        <group gutter="0">
          <cell v-for="quote in quoteList" :key="quote.insId" :title="quote.title" @click.native="toQuotePage(quote.insId)" :inline-desc='quote.desc+quote.askTimeStr'>
            <img slot="icon" width="30" style="display:block;margin-right:5px;" :src="quote.src">
          </cell>
          <load-more :show-loading="loadingMore" :tip="tipShow" background-color="#fbf9fe"></load-more>
        </group>
      </scroll>
    </div>
    <s-footer></s-footer>
  </div>
</template>
<script>
import { LoadMore, Divider, Tabbar, TabbarItem, XHeader, Cell, Group, Tab, TabItem, Badge } from 'vux'
import sHeader from '../components/header'
import sFooter from '../components/footer'
import scroll from '../components/scroll'
export default {
  components: {
    XHeader,
    Cell,
    Group,
    Tabbar,
    TabbarItem,
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
      loadingMore: false
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
      } else if (!this.loadingMore && this.quoteList.length) {
        return '下拉刷新'
      } else {
        return '暂无询价'
      }
    }
  },
  methods: {
    async _initData() {
      this.loadingMore = true
      await this.$http.get('/quote/list?pageNum=' + this.pageNum).then((response) => {
        let result = response.data
        if (result.code === 200) {
          this.quoteList.push(...result.data.list)
          this.pageNum++
        } else if (result.code === 1) {
          let vue = this
          this.$vux.alert.show({
            title: '错误',
            content: result.msg,
            onHide() {
              vue.$router.push({
                name: 'login'
              })
            }
          })
        } else {
          this.$vux.alert.show({
            title: '错误',
            content: result.msg
          })
        }
      }).catch((error) => {
        console.log(error)
        this.$vux.alert.show({
          title: '错误',
          content: '未知错误,请联系管理员'
        })
      })
      this.loadingMore = false
    },
    toQuotePage(insId) {
      this.$router.push({
        name: 'quote',
        params: {
          insId: insId
        }
      })
    },
    loadMore() {
      this._initData()
    }
  }
}
</script>

<style scoped lang="less">
.c-part-list {
  display: flex;
  flex-direction: column;
  .c-cell {
    flex: 0 0 auto;
  }
  .quote-list {
    display: flex;
    position: absolute;
    top: 84px;
    bottom: 40px;
    width: 100%;
    overflow: hidden;
  }
}
</style>