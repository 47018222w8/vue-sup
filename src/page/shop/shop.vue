<template>
  <div class="c-shop">
    <div class="c-body" v-if="member && sale">
      <div class="c-title s-div-block" style="padding-right:0;">
        <flexbox style="padding:15px 0">
          <flexbox-item style="margin-left: 0;" :span="3">
            <div class="c-img">
              <img width="50px;" height="50px;" src="http://img1.gamersky.com/image2017/10/20171028_zl_91_4/gamersky_02small_04_201710282218322.jpg" alt="">
            </div>
          </flexbox-item>
          <flexbox-item style="margin-left: 0px;">
            <p style="font-size:16px;">{{member.name}}&nbsp;&nbsp;
              <i class="fa fa-angle-right fa-lg"></i>
            </p>
            <p>查看门店基本信息</p>
          </flexbox-item>
          <flexbox-item style="margin-left: 0px;" :span="2">
            <!-- <br>
            <p class="c-shop-state">营业中</p> -->
          </flexbox-item>
        </flexbox>
      </div>
      <card class="c-col" v-if="member.parentid===0">
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
              <div class="c-fa s-div-right-border" @click="toOperate">
                <p style="color:#009688;">
                  <i slot="icon" class="fa fa-user fa-lg"></i>
                </p>
                <p>经营范围</p>
              </div>
            </flexbox-item>
            <flexbox-item style="margin-left:0px;">
              <div class="c-fa s-div-right-border" @click="toSaleMan">
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
              <p class="c-second-title">{{sale[0].count}}</p>
              <p class="s-p-desc" style="padding-bottom:5px;">历史 {{sale[1].count}}</p>
            </flexbox-item>
            <flexbox-item>
              <p class="s-p-desc" style="padding-top:5px;">近7天成交</p>
              <p class="c-second-title">{{sale[2].count}}</p>
              <p class="s-p-desc" style="padding-bottom:5px;">历史 {{sale[3].count}}</p>
            </flexbox-item>
            <flexbox-item>
              <p class="s-p-desc" style="padding-top:5px;">近7天战败</p>
              <p class="c-second-title">{{sale[0].count - sale[2].count}}</p>
              <p class="s-p-desc" style="padding-bottom:5px;">历史 {{sale[1].count - sale[3].count}}</p>
            </flexbox-item>
          </flexbox>
        </div>
      </card>
      <card class="c-data">
        <div slot="header">
          <p class="s-second-title" style="padding:10px 0;">为您推荐</p>
        </div>
        <div slot="content">
          <flexbox style="padding-bottom:10px;">
            <flexbox-item style="text-align:center;">
              <div class="c-img">
                <img src="http://192.168.1.109:9008/rfq/images/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20171128163621.jpg" width="60%" alt="">
              </div>
            </flexbox-item>
            <flexbox-item style="text-align:center;">
              <div class="c-img">
                <img src="http://192.168.1.109:9008/rfq/images/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20171128163621.jpg" width="60%" alt="">
              </div>
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
        demo1: true,
        member: null,
        sale: null
      }
    },
    created() {
      this.getMember()
    },
    methods: {
      async getMember() {
        await this.$http.get('/member').then((response) => {
          this.member = response.data
        })
        await this.$http.get('/salesStatistics/getSaleData').then((response) => {
          this.sale = response.data
        })
      },
      async _initData() {
        await this.$http.get('/insruances/' + this.$route.params.insId, { params: { state: '0' } }).then((response) => {
          let quote = response.data
          this.ins = quote.ins
          this.reportList = quote.reportPriceList
        })
      },
      toSaleMan() {
        this.member.majorBusiness === 1 && this.$router.push({ name: 'saleMan' })
        this.member.majorBusiness === 2 && this.$vux.toast.text('此功能暂未开放', 'middle')
      },
      toOperate() {
        this.member.majorBusiness === 1 && this.$router.push({ name: 'supCarBrand' })
        this.member.majorBusiness === 2 && this.$router.push({ name: 'supPartSort' })
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
    overflow: auto;
    height: calc(~"100vh - @{s-footer-height}");
    background-color: @s-background-color;
    .c-title {
      margin-top: 0px;
      background-color: @s-primary-color;
      color: #fff;
      .c-img {
        margin: 0 auto;
        background-color: #fff;
        height: 50px;
        width: 50px;
        border: 1px solid @s-hr-color;
      }
      .c-shop-state {
        text-align: center;
        background-color: #2bac38;
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
      .fa {
        padding-bottom: 10px;
      }
    }
    .c-data {
      padding-left: 10px;
      padding-right: 10px;
      .c-img {
        border: 1px solid @s-hr-color;
        margin: 0 auto;
        width: 85%;
      }
      .c-header {
        p {
          padding: 10px 0;
        }
      }
      .c-content {
        .c-second-title {
          font-size: 18px;
          color: red;
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