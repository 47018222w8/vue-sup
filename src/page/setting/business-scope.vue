<template>
  <div class="c-business-scope">
    <x-header :left-options="{preventGoBack:true,showBack:false}" :right-options="{showMore:false}" title="负责业务范围">
      <div slot="overwrite-left" @click="back">
        <i slot="icon" class="fa fa-chevron-left fa-lg"></i>
      </div>
      <div slot="right" v-if="memberId">
        <p :class="result.length?'':'s-p-desc'" @click="done">完成</p>
      </div>
    </x-header>
    <div class="c-body">
      <p class="s-p-desc" style="padding-left:10px;">绿色为经营范围</p>
      <div class="s-checker-brand">
        <load-more v-show="tipShow" :show-loading="loadingMore" :tip="tipText" background-color="#fbf9fe"></load-more>
        <checker v-model="result" type="checkbox" default-item-class="s-checker-brand-default" selected-item-class="s-checker-brand-selected">
          <checker-item :disabled="memberId?false:true" :value="item" v-for="(item, index) in carBrandList" :key="index">{{item.value}}</checker-item>
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
      back() {
        window.history.go(-1)
      },
      done() {
        if (this.result.length) {
          this.$vux.loading.show({
            text: '加载中'
          })
          let carBrandIdList = []
          this.result.forEach(item => carBrandIdList.push(item.key))
          this.$http.put('/suppliers/son', { memberId: this.memberId, carBrandIdList: carBrandIdList }).then((response) => {
            this.$vux.loading.hide()
            this.$vux.toast.show({
              text: '操作成功'
            })
            setTimeout(() => {
              this.$router.push({ name: 'saleMan' })
            }, 1500)
          }).catch((error) => {
            this.$vux.loading.hide()
            let result = error.response
            result.status === 403 && this.$vux.toast.show({
              text: result.data.message,
              type: 'warn',
              position: 'middle',
              time: '1500'
            })
            this.loading = false
          })
        }
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