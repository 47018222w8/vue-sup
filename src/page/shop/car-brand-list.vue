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
    <div class="c-body" v-show="showIndex===0">
      <scroll class="c-left" ref="scrollLeft" :click="true" :data="letterList">
        <div ref="brandDiv">
          <group v-for="(letter, lIndex) in letterList" :title="letter.character" :key="lIndex" class="brandHeight">
            <cell v-for="(carBrand, index) in letter.carBrandList" :key="index">
              <check-icon style="width:100%" slot="title" :value.sync="carBrand.check">{{carBrand.carBrandName}}</check-icon>
            </cell>
          </group>
        </div>
      </scroll>
      <div class="c-right">
        <ul>
          <li @click="goToLetter(lIndex)" v-for="(letter, lIndex) in letterList" :key="lIndex">{{letter.character}}</li>
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
    <load-more v-if="!letterList.length" :show-loading="loadingMore" :tip="tip" background-color="#fbf9fe"></load-more>
    <x-button slot="doneBtn" v-if="letterList.length" :disabled="doneDisabled" :show-loading="doneDisabled" @click.native="done" type="primary" :text="doneDisabled?'添加中...':'确认添加'"></x-button>
  </div>
</template>

<script>
  import { Divider, XButton, Cell, Group, Tab, TabItem, Search, Checklist, CheckIcon, LoadMore } from 'vux'
  import { REGISTER_DATA } from '@/store/mutation-type'
  import scroll from '@/components/scroll'
  export default {
    data() {
      return {
        letterList: [],
        brandHeights: [],
        showIndex: 0,
        searchList: [],
        brandsResult: [],
        doneDisabled: false,
        // 0:个人中心添加品牌 1:注册添加经营品牌
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
      LoadMore
    },
    created() {
      if (this.type === 0) {
        this.backParam.name = 'supCarBrand'
        this._initData0()
      }
      if (this.type === 1) {
        this.backParam.name = 'login'
        !this.$store.state.registerData && this.$router.push({ name: 'login' })
        this.formData = JSON.parse(JSON.stringify(this.$store.state.registerData))
        this._initData1()
      }
      setTimeout(() => {
        this._calculateHeight
      }, 20)
    },
    methods: {
      async _initData0() {
        await this.$http.get('/stores/0/carBrands').then((response) => {
          this.letterList = response.data
          if (!this.letterList.length) {
            this.tip = '已全部经营'
            this.loadingMore = false
          }
        })
      },
      async _initData1() {
        await this.$http.get('/noIntercept/carBrands').then((response) => {
          this.letterList = response.data
        })
      },
      // 添加完成
      done() {
        this.letterList.forEach((letter) => {
          letter.carBrandList.forEach((carBrand) => {
            carBrand.check && this.brandsResult.push(carBrand.carBrandId)
          })
        })
        if (this.brandsResult.length && !this.doneDisabled) {
          this.type === 0 && this.doneType0()
          this.type === 1 && this.doneType1()
        } else {
          this.$vux.toast.text('请至少选择一个品牌', 'middle')
        }
      },
      // 个人中心添加品牌
      async doneType0() {
        this.doneDisabled = true
        let parm = {
          carBrandIdList: this.brandsResult
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
      // 注册添加品牌
      doneType1() {
        this.formData.majorBusinessIds = this.brandsResult
        this.$store.commit(REGISTER_DATA, this.formData)
        this.$router.push({ name: 'register' })
      },
      search(value) {
        this.searchList = []
        value && this.letterList.forEach((letter) => {
          letter.carBrandList.forEach((carBrand) => {
            // 由于引用相同,所以结算时可以只计算letterList即可
            carBrand.carBrandName.indexOf(value) !== -1 && this.searchList.push(carBrand)
          })
        })
      },
      // 定位
      goToLetter(index) {
        this.$vux.toast.text(this.letterList[index].character, 'middle')
        this.$refs.scrollLeft.scrollTo(0, -this.brandHeights[index], 100)
      },
      // 计算高度
      _calculateHeight() {
        let brandDoms = this.$refs.brandDiv.querySelectorAll('.brandHeight')
        let height = 0
        let brandHeights = []
        brandHeights.push(height)
        for (let i = 0, l = brandDoms.length; i < l; i++) {
          let item = brandDoms[i]
          height += item.offsetHeight + 9
          brandHeights.push(height)
        }
        this.brandHeights = brandHeights
      }
    },
    watch: {
      // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
      letterList() {
        setTimeout(() => {
          this._calculateHeight()
        }, 30)
      }
    }
  }
</script>

<style scoped lang="less">
@import "../../styles/sup.less";
.c-car-brand {
  .display-flex;
  .flex-direction(column);
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