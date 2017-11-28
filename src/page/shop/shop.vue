<template>
  <div class="c-shop">
    <div class="c-body">
      <div class="c-title s-div-block" style="padding-right:0;">
        <flexbox style="padding:10px 0 10px 0">
          <flexbox-item :span="3">
            <div class="c-img">
              <img width="60px;" src="http://img1.gamersky.com/image2017/10/20171028_zl_91_4/gamersky_02small_04_201710282218322.jpg" alt="">
            </div>
          </flexbox-item>
          <flexbox-item>
            <p style="font-size:16px;">长春众联安顺&nbsp;&nbsp;
              <i class="fa fa-angle-right fa-lg"></i>
            </p>
            <p>查看门店基本信息</p>
          </flexbox-item>
          <flexbox-item :span="2">
            <br>
            <p class="c-shop-state">营业中</p>
          </flexbox-item>
        </flexbox>
      </div>
      <card class="c-col">
        <div slot="content">
          <flexbox>
            <flexbox-item style="margin-left:0px;">
              <div class="c-fa s-div-right-border" @click="$router.push({name: 'orders'})">
                <p style="color:#2196f3">
                  <i slot="icon" class="fa fa-navicon fa-lg"></i>
                </p>
                <p>订单管理</p>
              </div>
            </flexbox-item>
            <flexbox-item style="margin-left:0px;">
              <div class="c-fa s-div-right-border" @click="$router.push({name: 'customer'})">
                <p style="color:#009688;">
                  <i slot="icon" class="fa fa-user fa-lg"></i>
                </p>
                <p>客户管理</p>
              </div>
            </flexbox-item>
            <flexbox-item style="margin-left:0px;">
              <div class="c-fa s-div-right-border" @click="$router.push({name: 'saleMan'})">
                <p style="color:#E51C23;">
                  <i slot="icon" class="fa fa-user-o fa-lg"></i>
                </p>
                <p>业务员管理</p>
              </div>
            </flexbox-item>
            <flexbox-item style="margin-left:0px;">
              <div class="c-fa">
                <p style="color:#FF9800;">
                  <i slot="icon" class="fa fa-thumbs-o-up fa-lg"></i>
                </p>
                <p>评价管理</p>
              </div>
            </flexbox-item>
          </flexbox>
        </div>
      </card>
      <card class="c-data">
        <div slot="header">
          <flexbox class="s-div-bottom-border c-header">
            <flexbox-item>
              <p class="s-second-title">经营数据</p>
            </flexbox-item>
            <flexbox-item>
              <p class="s-p-desc" @click="$router.push({name: 'saleAnalysis'})" style="text-align:right;">更多&nbsp;
                <i class="fa fa-angle-right fa-lg"></i>
              </p>
            </flexbox-item>
          </flexbox>
        </div>
        <div class="c-content" slot="content">
          <flexbox>
            <flexbox-item>
              <p class="s-p-desc" style="padding-top:5px;">近7天报价</p>
              <p class="c-second-title">161</p>
              <p class="s-p-desc" style="padding-bottom:5px;">历史 549</p>
            </flexbox-item>
            <flexbox-item>
              <p class="s-p-desc" style="padding-top:5px;">近7天成交</p>
              <p class="c-second-title">161</p>
              <p class="s-p-desc" style="padding-bottom:5px;">历史 300</p>
            </flexbox-item>
            <flexbox-item>
              <p class="s-p-desc" style="padding-top:5px;">近7天战败</p>
              <p class="c-second-title">161</p>
              <p class="s-p-desc" style="padding-bottom:5px;">历史 249</p>
            </flexbox-item>
          </flexbox>
        </div>
      </card>
      <card class="c-data">
        <div slot="header">
          <p class="s-second-title" style="padding:10px 0;">为您推荐</p>
        </div>
        <div slot="content">
          <flexbox>
            <flexbox-item style="text-align:center;">
              <img src="http://img1.gamersky.com/image2017/10/20171028_zl_91_4/gamersky_03small_06_201710282218808.jpg" width="90%" alt="">
            </flexbox-item>
            <flexbox-item style="text-align:center;">
              <img src="http://img1.gamersky.com/image2017/10/20171028_zl_91_4/gamersky_05small_10_2017102822186DB.jpg" width="90%" alt="">
            </flexbox-item>
          </flexbox>
        </div>
      </card>
    </div>
  </div>
</template>

<script>
import { XHeader, XButton, Flexbox, FlexboxItem, CheckIcon, Card } from 'vux'
export default {
  data() {
    return {
      ins: {},
      reportList: {},
      showPart: true,
      demo1: true
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
    FlexboxItem,
    CheckIcon,
    Card
  }
}
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-shop {
  overflow: hidden;
  .c-body {
    .s-body;
    .c-title {
      margin-top: 0px;
      .c-img {
        .display-flex;
        .align-items(center);
        .justify-content(center);
        height: 60px;
        width: 80px;
        border: 1px solid @s-hr-color;
      }
      .c-shop-state {
        text-align: center;
        background-color: #2bac38;
        color: #fff;
        padding: 0;
      }
    }
    .c-col {
      p {
        text-align: center;
        padding: 0;
      }
      .c-fa {
        padding: 10px 0;
        text-align: center;
      }
    }
    .c-data {
      padding-left: 10px;
      padding-right: 10px;
      .c-header {
        p {
          padding: 10px 0;
        }
      }
      .c-content {
        .c-second-title {
          font-size: 18px;
          color: #000;
        }
        p {
          text-align: center;
          padding: 0px;
        }
      }
    }
  }
}
</style>