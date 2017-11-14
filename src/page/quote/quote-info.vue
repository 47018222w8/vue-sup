<template>
  <div style="background:#fff;">
    <div class="c-quote-info">
      <x-header :left-options="{preventGoBack:true}" :right-options="{showMore:false}" title="报价单详情">
        <div slot="overwrite-left" @click="toQuotePage">
          <i slot="icon" class="fa fa-chevron-left fa-lg"></i>
        </div>
      </x-header>
      <div class="c-body">
        <flexbox>
          <flexbox-item :span="1" style="background-color:#2196f3;color:#fff;text-align:center">
            <i class="fa fa-rocket fa-lg"></i>
          </flexbox-item>
          <flexbox-item>
            <div class="flex-demo">给【
              <span style="font-weight:bold">{{quote.repairName}}</span>】的报价单</div>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item :span="1">
            <h5 class="c-second-title">单号</h5>
          </flexbox-item>
          <flexbox-item>
            <p>{{quote.insNo}}</p>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item :span="1">
            <h5 class="c-second-title">车型</h5>
          </flexbox-item>
          <flexbox-item>
            <p>{{quote.carMark}}</p>
          </flexbox-item>
        </flexbox>
        <hr style="margin: 5px 1px;">
        <flexbox>
          <flexbox-item :span="2">
            <h5 class="c-second-title">报价明细</h5>
          </flexbox-item>
          <flexbox-item>
            <h5 class="c-second-title">下单零配件</h5>
          </flexbox-item>
        </flexbox>
        <div style="max-height:200px;">
          <div v-for="(rp, index) in quote.listRP" :key="index">
            <flexbox>
              <flexbox-item>
                <p>{{(index+1)+'.'+rp.name}}</p>
              </flexbox-item>
              <flexbox-item>
                <flexbox v-for="(item, index) in rp.listRPI" :key="'s'+index">
                  <flexbox-item>
                    <p>原厂件</p>
                  </flexbox-item>
                  <flexbox-item>
                    <p>¥{{item.reportPrice}}</p>
                  </flexbox-item>
                </flexbox>
              </flexbox-item>
            </flexbox>
            <hr class="s-hr-dashed">
          </div>
        </div>
        <br>
        <h5>运费及开票费用</h5>
        <p>运费:{{quote.expressMoney === 0? '免费':quote.expressMoney}}({{quote.arriveTimeStr}}点前到货)</p>
        <p>开票费用:{{quote.taxRate}}个点</p>
        <br>
        <flexbox>
          <flexbox-item :span="4">
            <x-button @click.native="toQuotePage">修改报价</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button type="primary">提交报价</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
  </div>
</template>

<script>
import { XHeader, XButton, Flexbox, FlexboxItem } from 'vux'
export default {
  data() {
    return {
      quote: this.$store.state.quote
    }
  },
  created() {
    console.log(this.$store.state.quote)
  },
  methods: {
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
.c-quote-info {
  h5 {
    padding: 5px 0;
  }
  .c-body {
    margin: 10px;
    background-color: #fff;
    .c-second-title {
      margin: 5px 0;
    }
    .s-hr-dashed {
      height:1px;border:none;border-top:1px dashed #BBB;
    }
  }
}
</style>