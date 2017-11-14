<template>
  <div class="c-order">
    <x-header :left-options="{preventGoBack:true}" :right-options="{showMore:false}" title="订单详情">
      <div slot="overwrite-left" @click="$router.push({name: 'orders'})">
        <i slot="icon" class="fa fa-chevron-left fa-lg"></i>
      </div>
    </x-header>
    <div class="c-body">
      <div class="c-first">
        <p class="s-first-title">
          <i class="fa fa-truck fa-lg"></i>&nbsp;&nbsp;待发货</p>
        <p class="s-first-title">班车/上门取货/代收货款/¥3000.77</p>
      </div>
      <div class="c-second">
        <p class="s-second-title">{{ins.entMemberName}}</p>
        <flexbox>
          <flexbox-item :span="10">
            <p class="s-p-desc">吉林省国家广告产业园907</p>
            <p class="s-p-desc">乔先生&nbsp;&nbsp;13112341234</p>
          </flexbox-item>
          <flexbox-item style="text-align:right;">
            <i style="color:#666;" class="fa fa-phone fa-lg"></i>
          </flexbox-item>
        </flexbox>
      </div>
      <br>
      <flexbox>
        <flexbox-item>
          <h5>本田思域</h5>
        </flexbox-item>
        <flexbox-item>
          <p style="text-align:right" class="s-p-desc">查看原始报价单&nbsp;
            <i class="fa fa-angle-right fa-lg"></i>
          </p>
        </flexbox-item>
      </flexbox>
      <br>
      <div>
        <flexbox>
          <flexbox-item>
            <p class="s-second-title">零部件(2个)</p>
          </flexbox-item>
          <flexbox-item>
            <p @click="changeShowPart" style="text-align:right" class="s-p-desc">{{showPart?'收起':'展开'}}&nbsp;
              <i :class="showPart?'fa fa-angle-up fa-lg':'fa fa-angle-down fa-lg'"></i>
            </p>
          </flexbox-item>
        </flexbox>
        <div v-show="showPart">
          <flexbox>
            <flexbox-item>
              <p>保险杠</p>
            </flexbox-item>
            <flexbox-item>
              <p>*1</p>
            </flexbox-item>
            <flexbox-item>
              <p>同质件</p>
            </flexbox-item>
            <flexbox-item>
              <p>¥3000</p>
            </flexbox-item>
          </flexbox>
          <flexbox>
            <flexbox-item>
              <p>保险杠</p>
            </flexbox-item>
            <flexbox-item>
              <p>*1</p>
            </flexbox-item>
            <flexbox-item>
              <p>同质件</p>
            </flexbox-item>
            <flexbox-item>
              <p>¥3000</p>
            </flexbox-item>
          </flexbox>
          <flexbox>
            <flexbox-item>
              <p>保险杠</p>
            </flexbox-item>
            <flexbox-item>
              <p>*1</p>
            </flexbox-item>
            <flexbox-item>
              <p>同质件</p>
            </flexbox-item>
            <flexbox-item>
              <p>¥3000</p>
            </flexbox-item>
          </flexbox>
        </div>
        <br>
        <flexbox>
          <flexbox-item>
            <p>零件总额:</p>
          </flexbox-item>
          <flexbox-item>
            <p style="text-align:right">¥3000</p>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item>
            <p>+运费:</p>
          </flexbox-item>
          <flexbox-item>
            <p style="text-align:right">¥0.00</p>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item>
            <p>+税:</p>
          </flexbox-item>
          <flexbox-item>
            <p style="text-align:right">¥0.00</p>
          </flexbox-item>
        </flexbox>
        <hr>
        <p style="text-align:right">合计金额:¥3000.89</p>
        <div class="c-ins">
          <flexbox>
            <flexbox-item>
              <p>订单编号:</p>
            </flexbox-item>
            <flexbox-item>
              <p class="s-p-desc" style="text-align:right">dewqewqewqewq</p>
            </flexbox-item>
          </flexbox>
          <flexbox>
            <flexbox-item>
              <p>下单时间:</p>
            </flexbox-item>
            <flexbox-item>
              <p class="s-p-desc" style="text-align:right">2017-11-6 17:48:04</p>
            </flexbox-item>
          </flexbox>
          <flexbox>
            <flexbox-item>
              <p>支付方式:</p>
            </flexbox-item>
            <flexbox-item>
              <p class="s-p-desc" style="text-align:right">货到付款</p>
            </flexbox-item>
          </flexbox>
          <flexbox>
            <flexbox-item>
              <p>发票信息</p>
            </flexbox-item>
            <flexbox-item>
              <p class="s-p-desc" style="text-align:right">不需要</p>
            </flexbox-item>
          </flexbox>
        </div>

      </div>
      <br>
    </div>
    <flexbox>
      <flexbox-item :span="6">
      </flexbox-item>
      <flexbox-item>
        <x-button type="primary" @click.native="$router.push({name: 'send'})">去发货</x-button>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
import { XHeader, XButton, Flexbox, FlexboxItem } from 'vux'
export default {
  data() {
    return {
      ins: {},
      reportList: {},
      showPart: true
    }
  },
  created() {
    // this._initData()
  },
  methods: {
    async _initData() {
      await this.$http.get('/insruances/' + this.$route.params.insId, { params: { state: '0' } }).then((response) => {
        let quote = response.data
        this.ins = quote.ins
        this.reportList = quote.reportPriceList
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
    FlexboxItem
  }
}
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-order {
  overflow: hidden;
  .c-body {
    overflow: auto;
    height: calc(~"100vh - @{vux-header-height} - @{vux-button-height} - 25px");
    background-color: #ffffff;
    margin: 10px;
    .c-first {
      .s-first-title {
        text-align: center;
      }
      .fa {
        color: @s-primary-color;
      }
    }
    .c-second-title {
      margin: 5px 0;
    }
    .hr0 {
      height: 1px;
      border: none;
      border-top: 1px dashed #bbb;
    }
  }
}
</style>