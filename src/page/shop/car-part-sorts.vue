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
    <div style="text-align:center;" v-if="!carPartSorts.length">
      <inline-loading></inline-loading>
      <span style="vertical-align:middle;display:inline-block;font-size:14px;">&nbsp;&nbsp;{{ '加载中...' }}</span>
    </div>
    <div class="c-body" v-show="showIndex===0">
      <scroll class="c-left" ref="scrollLeft" :click="true" :data="carPartSorts">
        <div ref="brandDiv">
          <group gutter="0" class="brandHeight">
            <cell v-for="(cp, index) in carPartSorts" :key="index">
              <check-icon style="width:100%" slot="title" :value.sync="cp.check">{{cp.name}}</check-icon>
            </cell>
          </group>
        </div>
      </scroll>
      <div class="c-right">
        <ul>
          <li @click="goToLetter(lIndex)" v-for="(letter, lIndex) in carPartSorts" :key="lIndex">{{letter.character}}</li>
        </ul>
      </div>
    </div>
    <div class="c-body" v-show="showIndex===1">
      <scroll class="c-left" :data="searchList">
        <div>
          <group>
            <cell v-for="(carBrand, index) in searchList" :key="index">
              <check-icon style="width:100%" slot="title" :value.sync="carBrand.check">{{carBrand.carBrandName}}</check-icon>
            </cell>
          </group>
        </div>
      </scroll>
    </div>
    <x-button slot="doneBtn" v-if="carPartSorts.length" :disabled="doneDisabled" :show-loading="doneDisabled" @click.native="done" type="primary" :text="doneDisabled?'添加中...':'确认添加'"></x-button>
  </div>
</template>

<script>
  import { Divider, XButton, Cell, Group, Tab, TabItem, Search, Checklist, CheckIcon, InlineLoading } from 'vux'
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
        formData: null
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
      InlineLoading
    },
    created() {
      if (this.type === 0) {
        this.backParam.name = 'supplierList'
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
        await this.$http.get('/stores/0/carBrands').then((response) => {
          this.carPartSorts = response.data
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
      async doneType0() {
        this.doneDisabled = true
        let parm = {
          carBrandIdList: this.results
        }
        await this.$http.post('/suppliers', parm).then((response) => {
        })
        this.$vux.toast.show({
          text: '添加成功',
          position: 'middle',
          time: '1500'
        })
        setTimeout(() => {
          this.$router.push(this.backParam)
        }, 1450)
      },
      // 注册添加专项件
      doneType1() {
        this.formData.majorBusinessIds = this.results
        this.$store.commit(REGISTER_DATA, this.formData)
        this.$router.push({ name: 'register' })
      },
      search(value) {
        this.searchList = []
        value && this.carPartSorts.forEach((letter) => {
          letter.carBrandList.forEach((carBrand) => {
            // 由于引用相同,所以结算时可以只计算letterList即可
            carBrand.carBrandName.indexOf(value) !== -1 && this.searchList.push(carBrand)
          })
        })
      }
    }
  }
</script>

<style scoped lang="less">
@import "../../styles/sup.less";
.c-car-brand {
  .display-flex;
  .flex-direction(column);
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
    .flex(none);
    .display-flex;
    overflow: hidden;
    .c-left {
      height: calc(~"100vh - @{vux-header-height} - @{vux-button-height}");
      .flex(auto);
    }
    .c-right {
      .display-flex;
      .align-items(center);
      .justify-content(center);
      .flex(0 0 10px);
      ul {
        list-style: none;
        li {
          text-align: center;
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}
</style>