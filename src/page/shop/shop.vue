<template>
  <div class="c-shop">
    <div class="c-title">
      <flexbox style="padding:18px 0 15px 0">
        <flexbox-item :span="3" style="text-align:center;">
          <img width="60px;" src="http://img1.gamersky.com/image2017/10/20171028_zl_91_4/gamersky_02small_04_201710282218322.jpg" alt="">
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
          <flexbox-item>
            <div class="c-fa">
              <p style="color:#2196f3">
                <i slot="icon" class="fa fa-navicon fa-lg"></i>
              </p>
              <p>订单管理</p>
            </div>
          </flexbox-item>
          <flexbox-item>
            <div @click="$router.push({name: 'customer'})">
              <p style="color:#009688;">
                <i slot="icon" class="fa fa-user fa-lg"></i>
              </p>
              <p>客户管理</p>
            </div>
          </flexbox-item>
          <flexbox-item>
            <div @click="$router.push({name: 'saleMan'})">
              <p style="color:#E51C23;">
                <i slot="icon" class="fa fa-user-o fa-lg"></i>
              </p>
              <p>业务员管理</p>
            </div>
          </flexbox-item>
          <flexbox-item>
            <div>
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
        <flexbox>
          <flexbox-item>
            <p class="s-second-title">经营数据</p>
          </flexbox-item>
          <flexbox-item>
            <p class="s-p-desc" @click="$router.push({name: 'sailAnalysis'})" style="text-align:right;">更多&nbsp;
              <i class="fa fa-angle-right fa-lg"></i>
            </p>
          </flexbox-item>
        </flexbox>
        <hr>
      </div>
      <div class="c-content" slot="content">
        <flexbox>
          <flexbox-item>
            <p class="s-p-desc">近7天报价</p>
            <p class="s-second-title">161</p>
            <p class="s-p-desc">历史 549</p>
          </flexbox-item>
          <flexbox-item>
            <p class="s-p-desc">近7天成交</p>
            <p class="s-second-title">161</p>
            <p class="s-p-desc">历史 300</p>
          </flexbox-item>
          <flexbox-item>
            <p class="s-p-desc">近7天战败</p>
            <p class="s-second-title">161</p>
            <p class="s-p-desc">历史 249</p>
          </flexbox-item>
        </flexbox>
      </div>
    </card>
    <card class="c-data">
      <div slot="header">
        <p class="s-second-title">为您推荐</p>
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
  .c-title {
    background: @s-primary-color;
    color: #fff;
    .c-shop-state {
      text-align: right;
      padding: 0 10px 0 0;
      background-color: #0c29c2;
    }
  }
  .c-col {
    p {
      text-align: center;
      padding: 0;
    }
    .c-fa {
      padding: 10px 0;
    }
  }
  .c-data {
    padding-left: 10px;
    padding-right: 10px;
    .c-content {
      p {
        text-align: center;
      }
    }
  }
}
</style>