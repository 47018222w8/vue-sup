<template>
  <div class="c-user-operate">
    <x-header :left-options="{preventGoBack:true}" :right-options="{showMore:false}" title="经营专项件">
      <div slot="overwrite-left" @click="back">
        <i slot="icon" class="fa fa-chevron-left fa-lg"></i>
      </div>
    </x-header>
    <div class="c-body">
      <checklist title="经营专项件" :options="operateCarPartList" v-model="checkList"></checklist>
    </div>
    <load-more v-if="!operateCarPartList.length" :show-loading="loadingMore" :tip="tip" background-color="#fbf9fe"></load-more>
    <div class="c-cell">
      <div class="c-btn">
        <x-button mini :disabled="delDisabled" @click.native="del" type="warn">删除选中项</x-button>
      </div>
      <div class="c-btn">
        <x-button mini @click.native="add" type="primary">新增</x-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { Divider, Cell, Group, Tab, TabItem, XButton, Checklist, XHeader, Spinner, InlineLoading, LoadMore } from 'vux'
  export default {
    data() {
      return {
        operateCarPartList: [],
        checkList: [],
        letterList: [],
        doneDisabled: false,
        tip: '加载中...',
        loadingMore: true
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
        await this.$http.get('/supplierCarParts', { params: { flag: '1' } }).then((response) => {
          response.data.forEach((value) => {
            this.operateCarPartList.push({ key: value.carPartSortId, value: value.name })
          })
          if (!this.operateCarPartList.length) {
            this.tip = '无经营专项件'
            this.loadingMore = false
          }
        })
      },
      // 添加品牌页
      add() {
        this.$router.push({
          name: 'carPartSorts',
          params: { type: 0 }
        })
      },
      back() {
        this.$router.push({
          name: 'shop'
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
            let sup = { carPartSortIdList: _this.checkList, flag: 0 }
            _this.$http.put('/supplierCarParts', sup).then((response) => {
              _this.$vux.toast.show({
                text: '删除成功',
                position: 'middle',
                time: '1500'
              })
              _this.operateCarPartList = []
              response.data.forEach((value) => {
                _this.operateCarPartList.push({ key: value.carPartSortId, value: value.name })
              })
              if (!_this.operateCarPartList.length) {
                _this.tip = '无经营专项件'
                _this.loadingMore = false
              }
            })
          }
        })
      }
    },
    components: {
      Divider,
      Cell,
      Group,
      Tab,
      TabItem,
      XButton,
      Checklist,
      XHeader,
      Spinner,
      InlineLoading,
      LoadMore
    }
  }
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-user-operate {
  .display-flex;
  .flex-direction(column);
  .c-body {
    flex: none;
    max-height: calc(~"100vh - @{vux-header-height} - 40px");
    overflow: auto;
  }
  .c-cell {
    .display-flex;
    .flex(none);
    .c-btn {
      .display-flex;
      .justify-content(center);
      .flex(0 0 50%);
    }
  }
}
</style>