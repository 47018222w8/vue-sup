<template>
  <div class="c-send">
    <x-header :left-options="{preventGoBack:true}" :right-options="{showMore:false}" title="发货">
      <div slot="overwrite-left" @click="$router.push({name: 'orders'})">
        <i slot="icon" class="fa fa-chevron-left fa-lg"></i>
      </div>
    </x-header>
    <div class="c-body s-div-bottom-border">
      <div class="s-div-block" style="margin-top:0px;">
        <p class="s-second-title">本次发货零配件清单({{partInfos.length}})</p>
        <flexbox v-for="(item, index) in partInfos" :key="index">
          <flexbox-item>
            <p>{{item.goodsName}}</p>
          </flexbox-item>
          <flexbox-item :span="2">
            <p>*{{item.num}}</p>
          </flexbox-item>
        </flexbox>
      </div>
      <group title="物流配送">
        <cell title="配送方式" value="班车"></cell>
        <cell title="物流电话" value="13312341234"></cell>
      </group>
      <group title="收货信息">
        <cell title="收货地址" :value="ins.shipArea"></cell>
        <cell title="维修厂名称" :value="ins.shipName"></cell>
        <cell title="联系电话" :value="ins.mobile"></cell>
      </group>
      <!-- <group :gutter="10">
        <cell-box>
          <flexbox align="start">
            <flexbox-item :span="3">
              <p>发货地址</p>
            </flexbox-item>
            <flexbox-item>
              <p class="s-p-desc">吉林省 长春市 二道区自由大路与郑州街交汇东行100米</p>
            </flexbox-item>
          </flexbox>
        </cell-box>
      </group> -->
    </div>
    <div class="s-footer-btn">
      <x-button style="width:80%" :disabled="loading" :show-loading="loading" type="primary" @click.native="sub">确认发货并通知物流</x-button>
    </div>
  </div>
</template>

<script>
  import { XHeader, XButton, Flexbox, FlexboxItem, CheckIcon, Group, Cell, CellBox } from 'vux'
  export default {
    data() {
      return {
        ins: {},
        partInfos: {},
        demo1: true,
        insId: this.$route.params.insId,
        mainSn: this.$route.query.mainSn,
        sonSn: this.$route.query.sonSn,
        insOrderId: this.$route.query.insOrderId,
        loading: false
      }
    },
    created() {
      this._initData()
    },
    methods: {
      async _initData() {
        await this.$http.get('/order/detail/' + this.insId + '/' + this.sonSn).then((response) => {
          this.ins = response.data
          this.partInfos = this.ins.itemList
        })
      },
      sub() {
        if (!this.loading) {
          this.$http.get('/order/sendGoods/' + this.insId + '/' + this.mainSn + '/' + this.insOrderId).then((response) => {
            this.$vux.toast.show({
              text: '发货成功',
              position: 'middle',
              time: '1400'
            })
            setTimeout(() => {
              this.$router.push({
                name: 'orders'
              })
            }, 1400)
          })
        }
      },
      toQuotePage() {
        this.$router.push({
          name: 'quote',
          params: {
            insId: this.$route.params.insId
          }
        })
      }
    },
    components: {
      scroll,
      XHeader,
      XButton,
      Flexbox,
      FlexboxItem,
      CheckIcon,
      Group,
      Cell,
      CellBox
    }
  }
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-send {
  overflow: hidden;
  .weui-icon-success {
    font-size: 18px;
  }
  .weui-icon-circle {
    font-size: 18px;
  }
  .c-body {
    overflow: auto;
    height: calc(~"100vh - @{vux-header-height} - @{vux-button-div-height}");
    background-color: @s-background-color;
  }
}
</style>