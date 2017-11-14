<template>
  <div class="c-send">
    <x-header :left-options="{preventGoBack:true}" :right-options="{showMore:false}" title="发货">
      <div slot="overwrite-left" @click="$router.push({name: 'order',params: {insId:1234}})">
        <i slot="icon" class="fa fa-chevron-left fa-lg"></i>
      </div>
    </x-header>
    <div class="c-body">
      <p class="s-first-title">本次发货零配件清单(8)</p>
      <div v-show="showPart">
        <flexbox>
          <flexbox-item>
            <p>保险杠</p>
          </flexbox-item>
          <flexbox-item :span="2">
            <p>*1</p>
          </flexbox-item>
          <flexbox-item :span="1">
            <check-icon :value.sync="demo1"></check-icon>
          </flexbox-item>
        </flexbox>
        <hr class="s-hr-dashed">
        <flexbox>
          <flexbox-item>
            <p>保险杠</p>
          </flexbox-item>
          <flexbox-item :span="2">
            <p>*1</p>
          </flexbox-item>
          <flexbox-item :span="1">
            <check-icon :value.sync="demo1"></check-icon>
          </flexbox-item>
        </flexbox>
        <hr class="s-hr-dashed">
        
      </div>
      <br>
      <p class="s-first-title">物流配送</p>
      <flexbox>
        <flexbox-item>
          <p>配送方式</p>
        </flexbox-item>
        <flexbox-item>
          <p style="text-align:right">班车</p>
        </flexbox-item>
      </flexbox>
      <flexbox>
        <flexbox-item>
          <p>物流电话</p>
        </flexbox-item>
        <flexbox-item>
          <p style="text-align:right">15604314441</p>
        </flexbox-item>
      </flexbox>
      <br>
      <p class="s-first-title">收货信息</p>
      <flexbox>
        <flexbox-item>
          <p>收货地址</p>
        </flexbox-item>
        <flexbox-item>
          <p style="text-align:right">吉林省 长春市 二道区自由大路与郑州街交汇东行100米</p>
        </flexbox-item>
      </flexbox>
      <flexbox>
        <flexbox-item>
          <p>维修厂名称</p>
        </flexbox-item>
        <flexbox-item>
          <p style="text-align:right">车益佰豪车管家豪泰店</p>
        </flexbox-item>
      </flexbox>
      <flexbox>
        <flexbox-item>
          <p>联系电话</p>
        </flexbox-item>
        <flexbox-item>
          <p style="text-align:right">15604316789</p>
        </flexbox-item>
      </flexbox>
      <flexbox>
        <flexbox-item>
          <p>发货地址</p>
        </flexbox-item>
        <flexbox-item>
          <p style="text-align:right">吉林省 长春市 朝阳区 高丽汽贸城1楼908室 中兴汽配</p>
        </flexbox-item>
      </flexbox>
      <br>
    </div>
    <flexbox>
      <flexbox-item :span="5">
      </flexbox-item>
      <flexbox-item>
        <x-button type="primary">确认发货并通知物流</x-button>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
import { XHeader, XButton, Flexbox, FlexboxItem, CheckIcon } from 'vux'
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
    CheckIcon
  }
}
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-send {
  overflow: hidden;
  .c-body {
    overflow: auto;
    height: calc(~"100vh - @{vux-header-height} - @{vux-button-height} - 25px");
    background-color: #ffffff;
    margin: 7px;
    padding: 5px;
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