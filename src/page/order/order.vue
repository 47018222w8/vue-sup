<template>
  <div class="c-order">
    <x-header :left-options="{preventGoBack:true, showBack: false}" :right-options="{showMore:false}" title="订单详情">
      <div slot="overwrite-left" @click="$router.push({name: 'orders'})">
        <i slot="icon" class="fa fa-chevron-left fa-lg"></i>
      </div>
    </x-header>
    <div class="c-body s-div-bottom-border">
      <div class="c-first">
        <p class="s-second-title">
          <i class="fa fa-truck fa-lg"></i>&nbsp;&nbsp;待发货</p>
        <p class="s-second-title">班车/上门取货/代收货款/¥{{ins.totalPrice}}</p>
      </div>
      <div class="s-div-block" style="padding-top:0px;">
        <p class="s-second-title">{{ins.repairName}}</p>
        <flexbox>
          <flexbox-item :span="10">
            <p class="s-p-desc">{{ins.memberAddress}}</p>
            <p class="s-p-desc">{{ins.contacter}}&nbsp;&nbsp;{{ins.mobile}}</p>
          </flexbox-item>
          <flexbox-item style="text-align:center;">
            <i style="color:#666;" class="fa fa-phone fa-lg"></i>
          </flexbox-item>
        </flexbox>
      </div>
      <group :gutter="10">
        <cell :title="ins.carBrandName" value="查看原始报价单" is-link></cell>
      </group>
      <div class="s-div-block">
        <flexbox style="padding-bottom:5px;">
          <flexbox-item>
            <p class="s-second-title">零部件({{partInfos.length}}个)</p>
          </flexbox-item>
          <flexbox-item>
            <p @click="changeShowPart" class="s-p-desc c-p-right">{{showPart?'收起':'展开'}}&nbsp;
              <i :class="showPart?'fa fa-angle-up fa-lg':'fa fa-angle-down fa-lg'"></i>
            </p>
          </flexbox-item>
        </flexbox>
        <div class="s-div-top-border" style="padding-top:5px;" v-show="showPart">
          <p>我是备注信息</p>
          <flexbox v-for="(item, index) in partInfos" :key="index" >
            <flexbox-item>
              <p>{{item.name}}</p>
            </flexbox-item>
            <flexbox-item :span="1">
              <p>*{{item.amount}}</p>
            </flexbox-item>
            <flexbox-item :span="3">
              <p>{{item.propertyName}}</p>
            </flexbox-item>
            <flexbox-item :span="2">
              <p>¥{{item.targetPrice}}</p>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
      <group :gutter="10">
        <cell title="零件总额:">
          <p>¥&nbsp;
            <span style="color:red;">3000</span>
          </p>
        </cell>
        <cell title="+运费:">
          <p>¥&nbsp;
            <span style="color:red;">{{ins.expressMoney}}</span>
          </p>
        </cell>
        <cell title="+税:">
          <p>¥&nbsp;
            <span style="color:red;">{{ins.taxRate}}</span>
          </p>
        </cell>
        <cell title="合计金额">
          <p>¥&nbsp;
            <span style="color:red;">¥{{ins.totalPrice}}</span>
          </p>
        </cell>
      </group>
      <group :gutter="10">
        <cell title="订单编号:" :value="ins.insNo"></cell>
        <cell title="下单时间:" :value="ins.orderTime"></cell>
        <cell title="支付方式:" value="货到付款"></cell>
        <cell title="发票信息:" value="不需要"></cell>
      </group>
    </div>
    <div class="s-footer-btn">
      <x-button style="width:80%" type="primary" @click.native="$router.push({name: 'send'})">确认接单并开始备货</x-button>
    </div>
  </div>
</template>

<script>
import { XHeader, XButton, Flexbox, FlexboxItem, Group, Cell, CellBox } from 'vux'
export default {
  data() {
    return {
      ins: {},
      partInfos: {},
      showPart: true
    }
  },
  created() {
    this._initData()
  },
  methods: {
    async _initData() {
      await this.$http.get('/orders/' + this.$route.params.insId, { params: { state: '0' } }).then((response) => {
        this.ins = response.data
        this.partInfos = this.ins.partInfos
      })
    },
    changeShowPart() {
      this.showPart ? this.showPart = false : this.showPart = true
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
    Group,
    Cell,
    CellBox
  }
}
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-order {
  overflow: hidden;
  p {
    padding-top: 2px;
    padding-bottom: 2px;
  }
  .c-body {
    overflow: auto;
    height: calc(~"100vh - @{vux-header-height} - @{vux-button-div-height}");
    background-color: @s-background-color;
    .c-p-right {
      text-align: right;
    }
    .c-first {
      .s-div-block;
      margin-top: 0;
      .s-first-title {
        text-align: center;
      }
      .fa {
        color: @s-primary-color;
      }
      p {
        text-align: center;
      }
    }
  }
}
</style>