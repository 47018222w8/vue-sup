<template>
  <div class="c-screen">
    <div class="c-body s-div-bottom-border">
      <group :gutter="0">
        <x-input text-align="right" title="单号" type="text" placeholder="请输入单号(支持模糊查询)" v-model="formData.insNo"></x-input>
        <flexbox :gutter="0">
          <flexbox-item>
            <datetime v-model="formData.beginDate" @on-change="changeDate" title="日期" placeholder="开始日期"></datetime>
          </flexbox-item>
          <flexbox-item>
            <datetime v-model="formData.endDate" @on-change="changeDate" title="至" placeholder="截止日期"></datetime>
          </flexbox-item>
        </flexbox>
        <p style="padding-left:15px;">状态</p>
        <checker v-model="formData.state" @on-change="changeState" type="checkbox" default-item-class="c-checker-state" selected-item-class="c-checker-state-selected">
          <checker-item @on-item-click="changeStateItem" :value="item" v-for="(item, index) in state" :key="index">{{item.value}}</checker-item>
        </checker>
        <p style="padding-left:15px;">品牌</p>
        <div class="s-checker-brand">
          <checker v-model="formData.carBrand" @on-change="changeBrand" type="checkbox" default-item-class="s-checker-brand-default" selected-item-class="s-checker-brand-selected">
            <checker-item :value="item" @on-item-click="changeBrandItem" v-for="(item, index) in carBrandList" :key="index">{{item.value}}</checker-item>
          </checker>
        </div>
      </group>
    </div>
    <div class="s-footer-btn">
      <x-button text="确定" style="width:80%;" @click.native="sub" type="primary"></x-button>
    </div>
  </div>
</template>
<script>
import { Divider, Cell, Group, Datetime, XInput, XButton, Flexbox, FlexboxItem, Checker, CheckerItem } from 'vux'
import scroll from '@/components/scroll'
import { SCREEN } from '@/store/mutation-type'
export default {
  name: 'quoteList',
  components: {
    Cell,
    Group,
    scroll,
    Divider,
    Datetime,
    XInput,
    XButton,
    Flexbox,
    FlexboxItem,
    Checker,
    CheckerItem
  },
  data() {
    return {
      formData: {},
      carBrandList: [{ key: 0, value: '全部' }],
      state: [{
        key: 0,
        value: '全部'
      }, {
        key: 1,
        value: '已报价'
      }, {
        key: 2,
        value: '已忽略'
      }, {
        key: 3,
        value: '战败'
      }, {
        key: 4,
        value: '已过期'
      }]
    }
  },
  created() {
    // 深拷贝
    this.formData = JSON.parse(JSON.stringify(this.$store.state.screen))
    this._initData()
  },
  methods: {
    async _initData() {
      await this.$http.get('/suppliers', { params: { flag: '1' } }).then((response) => {
        response.data.forEach((value) => {
          this.carBrandList.push({ key: value.carBrandId, value: value.carBrandName })
        })
      })
    },
    changeDate() {
      console.log(this.formData)
    },
    changeState(value) {
      // 都不全默认为全部
      if (!value.length) {
        this.formData.state = [this.state[0]]
      }
      // 选一个就不带全部了
      if (value.length === 2 && this.formData.state[0].key === 0) {
        this.formData.state.splice(0, 1)
      }
    },
    changeStateItem(value) {
      // 选全部其他就不选了
      if (value.key === 0) {
        this.formData.state = []
      }
    },
    changeBrand(value) {
      if (!value.length) {
        this.formData.carBrand = [this.carBrandList[0]]
      }
      if (value.length === 2 && this.formData.carBrand[0].key === 0) {
        this.formData.carBrand.splice(0, 1)
      }
    },
    changeBrandItem(value) {
      if (value.key === 0) {
        this.formData.carBrand = []
      }
    },
    sub() {
      this.$store.commit(SCREEN, this.formData)
      this.$router.push({ name: 'quoteList' })
    }
  }
}
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-screen {
  overflow: hidden;
  .c-body {
    overflow: auto;
    background-color: @s-background-color;
    height: calc(~"100vh - @{vux-header-height} - @{vux-button-div-height}");
    .c-checker-state {
      margin: 5px 2%;
      width: 16%;
      text-align: center;
    }
    .c-checker-state-selected {
      background-color: #009688;
      border-radius: 2px;
      color: #fff;
    }
  }
}
</style>