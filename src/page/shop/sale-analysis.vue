<template>
  <div class="c-sail-analysis">
    <x-header :left-options="{preventGoBack:true, showBack: false}" :right-options="{showMore:false}" title="销售分析">
      <div slot="overwrite-left" @click="$router.push({name: 'shop'})">
        <i slot="icon" class="fa fa-chevron-left fa-lg"></i>
      </div>
    </x-header>
    <div class="c-body">
      <card class="c-data">
        <div slot="header">
          <p class="s-second-title s-div-bottom-border">经营数据</p>
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
      <!-- <card class="c-count">
        <div slot="header">
          <p class="s-second-title">报价率统计</p>
        </div>
        <div class="c-content" slot="content">
          <flexbox>
            <flexbox-item>
              <div style="width:150px;height:150px;margin: 0 auto;">
                <x-circle :percent="38.91" :stroke-width="3" stroke-color="#04BE02">
                  <span>38.91%</span>
                </x-circle>
              </div>
              <p>总报价率</p>
            </flexbox-item>
            <flexbox-item>
              <div style="width:70px;height:70px;margin: 0 auto;">
                <x-circle :percent="16.00" :stroke-width="3" stroke-color="#04BE02">
                  <span>16.00%</span>
                </x-circle>
              </div>
              <p>5分钟报价率</p>
              <div style="width:70px;height:70px;margin: 0 auto;">
                <x-circle :percent="22.90" :stroke-width="3" stroke-color="#04BE02">
                  <span>22.90%</span>
                </x-circle>
              </div>
              <p>30分钟报价率</p>
            </flexbox-item>
          </flexbox>
        </div>
      </card> -->
      <card class="c-list">
        <div slot="header">
          <p>最近30天战败报价单列表</p>
        </div>
        <div slot="content">
          <flexbox class="s-div-bottom-border">
            <flexbox-item :span="2">
              <p>10.24</p>
            </flexbox-item>
            <flexbox-item>
              <p>一汽大众速腾</p>
            </flexbox-item>
            <flexbox-item>
              <p style="text-align:right;" class="s-p-desc ">查看原因</p>
            </flexbox-item>
          </flexbox>
        </div>
      </card>
    </div>
  </div>
</template>

<script>
  import { XHeader, XButton, Flexbox, FlexboxItem, CheckIcon, Card, XCircle } from 'vux'
  export default {
    data() {
      return {
        ins: {},
        reportList: {},
        showPart: true,
        demo1: true,
        sale: null
      }
    },
    created() {
      this._initData()
    },
    methods: {
      async _initData() {
        await this.$http.get('/salesStatistics/getSaleData').then((response) => {
          this.sale = response.data
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
      Card,
      XCircle
    }
  }
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-sail-analysis {
  overflow: hidden;
  .c-body {
    overflow: auto;
    height: calc(~"100vh - @{vux-header-height}");
    background-color: @s-background-color;
    .c-data {
      padding: 0 10px 0 10px;
      .c-second-title {
        font-size: 18px;
        color: #000;
      }
      .c-content {
        p {
          text-align: center;
        }
      }
    }
    .c-count {
      padding: 0 10px 0 10px;
      p {
        text-align: center;
        color: @s-desc-font-color;
        padding: 5px 0px;
      }
    }
    .c-list {
      padding: 0 10px 0 10px;
      p {
        padding: 5px 0px;
      }
    }
  }
}
</style>