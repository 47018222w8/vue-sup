<template>
  <div>
    <div v-show="showIndex===0" class="c-user-operate">
      <x-header on-click-back="$router.push({name: 'userCenter'}}" :right-options="{showMore:false}" title="经营品牌"></x-header>
      <div class="c-body">
        <checklist title="经营品牌" :options="operateCarBrandList" v-model="checkList"></checklist>
      </div>
      <div style="text-align:center;" v-if="!operateCarBrandList.length">
        <inline-loading></inline-loading>
        <span style="vertical-align:middle;display:inline-block;font-size:14px;">&nbsp;&nbsp;{{ '加载中...' }}</span>
      </div>
      <div class="c-cell" v-else>
        <div class="c-btn">
          <x-button mini :disabled="delDisabled" @click.native="del" type="warn">删除选中品牌</x-button>
        </div>
        <div class="c-btn">
          <x-button mini @click.native="add" type="primary">新增经营品牌</x-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sFooter from '../components/footer'
import sHeader from '../components/header'
import { Divider, Cell, Group, Tab, TabItem, XButton, Checklist, XHeader, Spinner, InlineLoading } from 'vux'
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
    add() {
      this.$router.push({
        name: 'carBrandList',
        params: { type: 0 }
      })
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
    Divider,
    Cell,
    Group,
    Tab,
    TabItem,
    XButton,
    Checklist,
    XHeader,
    Spinner,
    InlineLoading
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
    max-height: calc(~"100vh - @{vux-header-height} - 40px");
    overflow: auto;
  }
}
</style>