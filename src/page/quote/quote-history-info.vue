<template>
  <div style="background:#fff;">
    <div class="c-quote-info">
      <x-header :left-options="{preventGoBack:true}" :right-options="{showMore:false}" title="报价单详情">
        <div slot="overwrite-left" @click="$router.push({name:'quoteHistory'})">
          <i slot="icon" class="fa fa-chevron-left fa-lg"></i>
        </div>
      </x-header>
      <div class="c-body" v-if="ins">
        <flexbox>
          <flexbox-item :span="1" style="padding-left:10px;">
            <div style="background-color:#2196f3;color:#fff;text-align:center;">
              <i class="fa fa-rocket fa-lg"></i>
            </div>
          </flexbox-item>
          <flexbox-item>
            <p class="s-second-title" style="width:90%">给【{{ins.entMemberName}}】的报价单
            </p>
          </flexbox-item>
        </flexbox>
        <group :gutter="10">
          <cell title="单号" :value="ins.insNo"></cell>
          <cell title="车型" :value="ins.carMark"></cell>
        </group>
        <group :gutter="10">
          <cell title="运费" :value="ins.expressMoney"></cell>
          <cell title="税点" :value="ins.taxRate"></cell>
        </group>
        <group title="报价明细 下单零配件">
          <cell-box v-for="(rp, index) in list" :key="index">
            <flexbox>
              <flexbox-item>
                <p>{{(index+1)+'.'+rp.name}}</p>
              </flexbox-item>
              <flexbox-item>
                <p>{{rp.qualityRequirementName}}</p>
              </flexbox-item>
              <flexbox-item>
                <p>¥{{rp.reportPrice}}</p>
              </flexbox-item>
            </flexbox>
          </cell-box>
          <cell v-if="list.length === 0" title="您没有经营的零件"></cell>
        </group>
      </div>
    </div>
  </div>
</template>

<script>
import { XHeader, XButton, Flexbox, FlexboxItem, Cell, Group, CellBox, XInput, Datetime } from 'vux'
export default {
  data() {
    return {
      ins: null,
      list: null
    }
  },
  created() {
    this._initData()
  },
  methods: {
    async _initData() {
      await this.$http.get('/insruances/' + this.$route.params.insId + '/history').then((response) => {
        this.ins = response.data.ins
        this.list = response.data.reportPriceInfoList
      })
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
    Datetime
  }
}
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-quote-info {
  overflow: hidden;
  .c-body {
    overflow: auto;
    height: calc(~"100vh - @{vux-header-height}");
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