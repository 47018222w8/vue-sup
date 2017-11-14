<template>
  <div class="c-sale-man-add">
    <x-header :left-options="{preventGoBack:true,showBack: false}" :right-options="{showMore:false}" title="业务员信息">
      <div slot="left" @click="$router.push({name: 'saleMan'})">
        取消
      </div>
      <div slot="right" @click="$router.push({})">完成</div>
    </x-header>
    <div class="c-body">
      <group label-width="4.5em" label-margin-right="2em" label-align="right">
        <x-input title="姓名" placeholder="请输入业务员姓名" :required="true" placeholder-align="left"></x-input>
        <x-input title="登录账号" placeholder="请输入登录账号" :required="true" placeholder-align="left"></x-input>
        <x-input title="登录密码" placeholder="请输入登录密码" :required="true" placeholder-align="left"></x-input>
      </group>
      <p>选择此业务员负责的业务范围(默认为全部)</p>
      <p class="s-p-desc">绿色为选中,点击可取消</p>
      <div class="c-brand">
        <checker v-model="formData.carBrand" @on-change="changeBrand" type="checkbox" default-item-class="c-checker-brand" selected-item-class="c-checker-brand-selected">
          <checker-item :value="item" @on-item-click="changeBrandItem" v-for="(item, index) in carBrandList" :key="index">{{item.value}}</checker-item>
        </checker>
      </div>
    </div>
  </div>
</template>

<script>
import { XHeader, XButton, Flexbox, FlexboxItem, XInput, Group, Checker, CheckerItem } from 'vux'
export default {
  data() {
    return {
      formData: { carBrand: [{ key: 0, value: '全部' }] },
      carBrandList: [{ key: 0, value: '全部' }],
      ins: {},
      reportList: {},
      showPart: true,
      demo1: true
    }
  },
  created() {
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
    }
  },
  components: {
    scroll,
    XHeader,
    XButton,
    Flexbox,
    FlexboxItem,
    XInput,
    Group,
    Checker,
    CheckerItem
  }
}
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-sale-man-add {
  overflow: hidden;
  .c-body {
    overflow: auto;
    height: calc(~"100vh - @{vux-header-height}");
    .c-brand {
      overflow: auto;
      .c-checker-brand {
        margin: 5px 2%;
        width: 20%;
        text-align: center;
      }
      .c-checker-brand-selected {
        background-color: #009688;
        border-radius: 2px;
        color: #fff;
      }
    }
  }
}
</style>