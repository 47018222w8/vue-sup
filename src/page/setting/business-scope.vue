<template>
  <div class="c-business-scope">
    <x-header :left-options="{preventGoBack:true,showBack:false}" :right-options="{showMore:false}" title="负责业务范围">
      <div slot="left" @click="$router.push({name: 'account'})">
        取消
      </div>
      <div class="s-p-desc" slot="right" @click="done">
        完成
      </div>
    </x-header>
    <div class="c-body">
      <p class="s-p-desc" style="padding-left:10px;">绿色为选中,点击可取消</p>
      <div class="s-checker-brand">
        <checker v-model="formData.carBrand" @on-change="changeBrand" type="checkbox" default-item-class="s-checker-brand-default" selected-item-class="s-checker-brand-selected">
          <checker-item :value="item" @on-item-click="changeBrandItem" v-for="(item, index) in carBrandList" :key="index">{{item.value}}</checker-item>
        </checker>
      </div>
    </div>
  </div>
</template>

<script>
import { XHeader, Checker, CheckerItem } from 'vux'
export default {
  data() {
    return {
      formData: { carBrand: [{ key: 0, value: '全部' }] },
      carBrandList: [{ key: 0, value: '全部' }]
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
    },
    done() {
    }
  },
  components: {
    scroll,
    XHeader,
    Checker,
    CheckerItem
  }
}
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-business-scope {
  overflow: hidden;
  height: 100vh;
  background-color: #fff;
  .c-body {
    overflow: auto;
    height: calc(~"100vh - @{vux-header-height}");
    background-color: @s-background-color;
  }
}
</style>