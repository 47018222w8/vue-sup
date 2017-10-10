<template>
  <div>
    <div v-show="showIndex===0" class="c-user-operate">
      <s-header class="c-cell" :returnName="'userCenter'" :title="'找件儿'"></s-header>
      <!-- <car-brand class="c-body"></car-brand> -->
      <div class="c-body">
        <checklist title="经营品牌" :options="operateCarBrandList" v-model="checkList"></checklist>
      </div>
      <div class="c-cell" v-if="operateCarBrandList.length">
        <div class="c-btn">
          <x-button mini :disabled="delDisabled" @click.native="del" type="warn">删除选中品牌</x-button>
        </div>
        <div class="c-btn">
          <x-button mini @click.native="add" type="primary">新增经营品牌</x-button>
        </div>
      </div>
    </div>
    <car-brand v-show="showIndex===1" :letterList="letterList" ref="carBrand">
      <i @click="back" class="fa fa-angle-left fa-2x" slot="leftIcon"></i>
      <x-button slot="doneBtn" :disabled="doneDisabled" :show-loading="doneDisabled" @click.native="done" type="primary" :text="doneDisabled?'添加中...':'确认添加'"></x-button>
    </car-brand>
  </div>
</template>

<script>
import sFooter from '../components/footer'
import sHeader from '../components/header'
import constant from '../components/constant'
import { Divider, Cell, Group, Tab, TabItem, XButton, Checklist } from 'vux'
import carBrand from '../components/car-brand'
export default {
  data() {
    return {
      operateCarBrandList: [],
      checkList: [],
      letterList: [],
      showIndex: 0,
      doneDisabled: false
    }
  },
  created() {
    this._initData()
  },
  computed: {
    delDisabled() {
      if (this.checkList.length === 0) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    async _initData() {
      await this.$http.get('/suppliers', { params: { flag: '1' } }).then((response) => {
        response.data.forEach((value) => {
          this.operateCarBrandList.push({ key: value.carBrandId, value: value.carBrandName })
        })
      })
    },
    // 添加品牌页
    async add() {
      this.$vux.loading.show({
        text: '加载中'
      })
      await this.$http.get('/stores/0/carBrands').then((response) => {
        this.letterList = response.data
      })
      this.showIndex = 1
      this.$vux.loading.hide()
    },
    // 添加品牌
    async done() {
      let carBrandIdList = this.$refs.carBrand.done()
      if (carBrandIdList && !this.doneDisabled) {
        this.doneDisabled = true
        let parm = {
          carBrandIdList: carBrandIdList
        }
        await this.$http.post('/suppliers', parm).then((response) => {
          this.operateCarBrandList = []
          response.data.forEach((value) => {
            this.operateCarBrandList.push({ key: value.carBrandId, value: value.carBrandName })
          })
          this.$vux.toast.show({
            text: '添加成功',
            position: 'middle',
            time: '1500'
          })
        })
        this.doneDisabled = false
        this.showIndex = 0
      }
    },
    back() {
      this.showIndex = 0
    },
    del() {
      let _this = this
      this.$vux.confirm.show({
        title: '提示',
        content: '确认删除吗?',
        onCancel() {
        },
        onConfirm() {
          let sup = { carBrandIdList: _this.checkList, flag: 0 }
          _this.$http.put('/suppliers', sup).then((response) => {
            _this.$vux.toast.show({
              text: '删除成功',
              position: 'middle',
              time: '1500'
            })
            _this.operateCarBrandList = []
            response.data.forEach((value) => {
              _this.operateCarBrandList.push({ key: value.carBrandId, value: value.carBrandName })
            })
          })
        }
      })
    }
  },
  components: {
    sFooter,
    sHeader,
    constant,
    Divider,
    Cell,
    Group,
    Tab,
    TabItem,
    carBrand,
    XButton,
    Checklist
  }
}
</script>

<style lang="less">
.c-user-operate {
  @import '../styles/sup.less';
  .display-flex;
  .flex-direction(column);
  .c-cell {
    .display-flex;
    .flex(none);
    .c-btn {
      .display-flex;
      .justify-content(center);
      .flex(0 0 50%);
    }
  }
  .c-body {
    flex: none;
    max-height: 100-(@s-header-height+@s-footer-height);
    overflow: auto;
  }
}
</style>