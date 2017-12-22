<template>
  <div class="c-car-brand">
    <div class="c-header">
      <div class="c-icon" @click="$router.push(backParam)">
        <i v-if="type===0" class="fa fa-angle-left fa-2x" slot="leftIcon"></i>
        <i v-else class="fa fa-times fa-lg" slot="icon"></i>
      </div>
      <div class="c-cell">
        <search @on-focus="showIndex = 1" @on-cancel="showIndex = 0" @on-change="search" :autoFixed="false">
        </search>
      </div>
      <div class="c-icon">
        <slot name="rightIcon"></slot>
      </div>
    </div>
    <load-more v-if="!carPartSorts.length" :show-loading="loadingMore" :tip="tip" background-color="#fbf9fe"></load-more>
    <div class="c-body" v-show="showIndex===0">
      <group gutter="0" class="brandHeight">
        <cell v-for="(cp, index) in carPartSorts" :key="index">
          <check-icon style="width:100%" slot="title" :value.sync="cp.check">{{cp.name}}</check-icon>
        </cell>
      </group>
    </div>
    <div class="c-body" v-show="showIndex===1">
      <group>
        <cell v-for="(cp, index) in searchList" :key="index">
          <check-icon style="width:100%" slot="title" :value.sync="cp.check">{{cp.name}}</check-icon>
        </cell>
      </group>
    </div>
    <x-button slot="doneBtn" v-if="carPartSorts.length" :disabled="doneDisabled" :show-loading="doneDisabled" @click.native="done" type="primary" :text="doneDisabled?'添加中...':'确认添加'"></x-button>
  </div>
</template>

<script>
  import { Divider, XButton, Cell, Group, Tab, TabItem, Search, Checklist, CheckIcon, InlineLoading, LoadMore } from 'vux'
  import { REGISTER_DATA } from '@/store/mutation-type'
  import scroll from '@/components/scroll'
  export default {
    data() {
      return {
        carPartSorts: [],
        showIndex: 0,
        searchList: [],
        results: [],
        doneDisabled: false,
        // 0:个人中心添加专项件 1:注册添加经营专项件
        type: +this.$route.params.type,
        backParam: {},
        formData: null,
        tip: '加载中...',
        loadingMore: true
      }
    },
    components: {
      Search,
      Divider,
      Cell,
      Group,
      Tab,
      TabItem,
      scroll,
      Checklist,
      CheckIcon,
      XButton,
      InlineLoading,
      LoadMore
    },
    created() {
      if (this.type === 0) {
        this.backParam.name = 'supPartSort'
        this._initData0()
      }
      if (this.type === 1) {
        this.backParam.name = 'login'
        !this.$store.state.registerData && this.$router.push({ name: 'login' })
        this.formData = JSON.parse(JSON.stringify(this.$store.state.registerData))
        this._initData1()
      }
    },
    methods: {
      async _initData0() {
        await this.$http.get('/stores/0/carParts').then((response) => {
          this.carPartSorts = response.data
          if (!this.carPartSorts) {
            this.tip = '已全部经营'
            this.loadingMore = false
          }
        })
      },
      async _initData1() {
        await this.$http.get('/noIntercept/carPartSorts').then((response) => {
          this.carPartSorts = response.data
        })
      },
      // 添加完成
      done() {
        this.carPartSorts.forEach((item) => {
          item.check && this.results.push(item.id)
        })
        if (this.results.length && !this.doneDisabled) {
          this.type === 0 && this.doneType0()
          this.type === 1 && this.doneType1()
        } else {
          this.$vux.toast.text('请至少选择一个专项件', 'middle')
        }
      },
      // 个人中心添加专项件
      doneType0() {
        this.doneDisabled = true
        let parm = {
          carPartSortIdList: this.results
        }
        this.$http.post('/supplierCarParts', parm).then((response) => {
          this.$vux.toast.show({
            text: '添加成功',
            position: 'middle',
            time: '1500'
          })
          setTimeout(() => {
            this.$router.push(this.backParam)
          }, 1450)
        })
      },
      // 注册添加专项件
      doneType1() {
        this.formData.majorBusinessIds = this.results
        this.$store.commit(REGISTER_DATA, this.formData)
        this.$router.push({ name: 'register' })
      },
      search(value) {
        this.searchList = []
        value && this.carPartSorts.forEach((item) => {
          item.name.indexOf(value) !== -1 && this.searchList.push(item)
        })
      }
    }
  }
</script>

<style scoped lang="less">
@import "../../styles/sup.less";
.c-car-brand {
  overflow: hidden;
  .c-header {
    .flex(none);
    .display-flex;
    background-color: @search-bg-color;
    .c-cell {
      .flex(auto);
    }
    .c-icon {
      .display-flex;
      .flex(0 0 5%);
      .align-items(center);
      .justify-content(center);
      color: @search-placeholder-font-color;
    }
    .c-done {
      .display-flex;
      .flex(0 0 10%);
      .align-items(center);
      .justify-content(center);
      color: @s-primary-color;
    }
  }
  .c-body {
    height: calc(~"100vh - @{vux-tab-height} - @{vux-button-height}");
    overflow: auto;
  }
}
</style>