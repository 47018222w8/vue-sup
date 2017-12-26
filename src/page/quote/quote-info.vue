<template>
  <div style="background:#fff;">
    <div class="c-quote-info">
      <x-header :left-options="{preventGoBack:true}" :right-options="{showMore:false}" title="报价单详情">
        <div slot="overwrite-left" @click="toQuotePage">
          <i slot="icon" class="fa fa-chevron-left fa-lg"></i>
        </div>
      </x-header>
      <div class="c-body" v-if="quote">
        <flexbox>
          <flexbox-item :span="1" style="padding-left:10px;">
            <div style="background-color:#2196f3;color:#fff;text-align:center;">
              <i class="fa fa-rocket fa-lg"></i>
            </div>
          </flexbox-item>
          <flexbox-item>
            <p class="s-second-title" style="width:90%">给【{{quote.repairName}}】的报价单
            </p>
          </flexbox-item>
        </flexbox>
        <group :gutter="10">
          <cell title="单号" :value="quote.insNo"></cell>
          <cell title="车型" :value="quote.carMark"></cell>
        </group>
        <group :gutter="10">
          <x-input title="运费" type="number" text-align="right" v-model="quote.expressMoney"></x-input>
          <x-input title="票点" type="number" text-align="right" v-model="quote.taxRate">
            <span slot="right">%</span>
          </x-input>
          <datetime class="c-datetime" @click.native="blur" v-model="quote.canShipDateBsStr" format="YYYY-MM-DD HH" title="发货时间" value-text-align="right"></datetime>
        </group>
        <group title="报价明细">
          <cell-box v-for="(rp, index) in quote.listRPShow" :key="index">
            <flexbox align="start">
              <flexbox-item>
                <p>{{(index+1)+'.'+rp.name}}</p>
              </flexbox-item>
              <flexbox-item>
                <flexbox v-for="(item, index) in rp.listRPI" :key="'s'+index">
                  <flexbox-item>
                    <p>{{item.qualityRequirementName}}</p>
                  </flexbox-item>
                  <flexbox-item>
                    <p>¥{{item.reportPrice}}</p>
                  </flexbox-item>
                </flexbox>
              </flexbox-item>
            </flexbox>
          </cell-box>
          <cell v-if="quote.listRPShow.length === 0" title="您没有经营的零件"></cell>
        </group>
      </div>
      <div class="s-footer-btn">
        <flexbox>
          <flexbox-item>
            <x-button style="width:90%" :disabled="loading" @click.native="toQuotePage">修改报价</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button style="width:90%" :disabled="loading" :show-loading="loading" @click.native="sub" type="primary">提交报价</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <x-dialog v-model="showDialog" class="c-dialog" hide-on-blur>
      <p style="padding:10px 0;">
        该询价需要发票,确认不输入税点吗?
      </p>
      <flexbox :gutter="0">
        <flexbox-item>
          <x-button @click.native="showDialog = false">取消</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button @click.native="subSon" type="primary">确认</x-button>
        </flexbox-item>
      </flexbox>
    </x-dialog>
  </div>
</template>

<script>
  import { XHeader, XButton, Flexbox, FlexboxItem, Cell, Group, CellBox, XInput, Datetime, XDialog } from 'vux'
  import { RE_MONEY } from '@/components/constant'
  export default {
    data() {
      return {
        quote: this.$store.state.quote,
        loading: false,
        showDialog: false
      }
    },
    created() {
      !this.quote && this.toQuotePage()
    },
    methods: {
      toQuotePage() {
        this.$router.go(-1)
      },
      sub() {
        if (this.validate() && !this.loading) {
          if (this.quote.isInvoice === 1 && !this.quote.taxRate) {
            this.showDialog = true
            return
          }
          this.subSon()
        }
      },
      subSon() {
        this.showDialog = false
        this.loading = true
        this.$http.post('/reportPriceInfos', this.quote).then((response) => {
          // todo:名字应该提出来
          localStorage.removeItem('reportPriceList' + this.quote.insId)
          this.$router.push({
            name: 'quoteSuccess'
          })
        })
      },
      validate() {
        if (this.quote.expressMoney !== 0 && !RE_MONEY.test(this.quote.expressMoney)) {
          this.$vux.toast.text('请输入正确的运费', 'bottom')
          return false
        }
        if (this.quote.taxRate === '') {
          this.$vux.toast.text('请输入税点', 'bottom')
          return false
        }
        if (!this.quote.canShipDateBsStr) {
          this.$vux.toast.text('请选择发货时间', 'bottom')
          return false
        }
        return true
      }
    },
    components: {
      scroll,
      XHeader,
      XButton,
      Flexbox,
      FlexboxItem,
      Cell,
      Group,
      CellBox,
      XInput,
      Datetime,
      XDialog
    }
  }
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-quote-info {
  overflow: hidden;
  .c-body {
    overflow: auto;
    height: calc(~"100vh - @{vux-header-height} - @{vux-button-div-height}");
    background-color: @s-background-color;
    border-bottom: 1px solid @s-hr-color;
    .s-hr-dashed {
      height: 1px;
      border: none;
      border-top: 1px dashed #bbb;
    }
    .c-datetime {
      p {
        padding-top: 0;
        padding-bottom: 0;
      }
    }
  }
}
</style>