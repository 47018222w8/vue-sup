<template>
  <div class="c-business-scope">
    <x-header :left-options="{preventGoBack:true,showBack:false}" :right-options="{showMore:false}" title="负责业务范围">
      <div slot="left" @click="$router.push({name: 'account'})">
        取消
      </div>
      <div class="s-p-desc" slot="right" @click="done">
        完成
      </div>
    </x-header>
    <div class="c-body">
      <p class="s-p-desc" style="padding-left:10px;">绿色为选中,点击可取消</p>
      <div class="s-checker-brand">
        <load-more v-show="tipShow" :show-loading="loadingMore" :tip="tipText" background-color="#fbf9fe"></load-more>
        <checker v-model="result" type="checkbox" default-item-class="s-checker-brand-default" selected-item-class="s-checker-brand-selected">
          <checker-item :value="item" v-for="(item, index) in carBrandList" :key="index">{{item.value}}</checker-item>
        </checker>
      </div>
    </div>
  </div>
</template>

<script>
  import { XHeader, Checker, CheckerItem, LoadMore } from 'vux'
  export default {
    data() {
      return {
        result: [],
        carBrandList: [],
        memberId: 0,
        loadingMore: true,
        tipShow: true,
        tipText: '加载中...'
      }
    },
    created() {
      this.memberId = this.$route.params.memberId
      this._initData()
    },
    methods: {
      async _initData() {
        await this.$http.get('/suppliers/son/' + this.memberId).then((response) => {
          response.data.supList.forEach((value) => {
            this.carBrandList.push({ key: value.carBrandId, value: value.carBrandName })
          })
          response.data.supSonList.forEach((value) => {
            this.result.push({ key: value.carBrandId, value: value.carBrandName })
          })
          this.loadingMore = false
          this.tipShow = false
        })
      },
      done() {
      }
    },
    components: {
      scroll,
      XHeader,
      Checker,
      CheckerItem,
      LoadMore
    }
  }
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-business-scope {
  overflow: hidden;
  height: 100vh;
  background-color: #fff;
  .c-body {
    overflow: auto;
    height: calc(~"100vh - @{vux-header-height}");
    background-color: @s-background-color;
  }
}
</style>