<template>
  <div class="c-car-brand" v-if="letterList">
    <div class="c-header">
      <div class="c-icon">
        <slot name="leftIcon"></slot>
      </div>
      <div class="c-cell">
        <search @on-focus="showIndex = 1" @on-cancel="showIndex = 0" @on-change="search" :autoFixed="false">
        </search>
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
    <slot name="doneBtn"></slot>
  </div>
</template>

<script>
import constant from '../components/constant'
import { Divider, XButton, Cell, Group, Tab, TabItem, Search, Checklist, CheckIcon } from 'vux'
import scroll from '../components/scroll'
export default {
  props: {
    letterList: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      brandHeights: [],
      showIndex: 0,
      searchList: [],
      brandsResult: []
    }
  },
  components: {
    Search,
    constant,
    Divider,
    Cell,
    Group,
    Tab,
    TabItem,
    scroll,
    Checklist,
    CheckIcon,
    XButton
  },
  mounted() {
    setTimeout(() => {
      this._calculateHeight
    }, 20)
  },
  methods: {
    done() {
      this.letterList.forEach((letter) => {
        letter.carBrandList.forEach((carBrand) => {
          carBrand.check && this.brandsResult.push(carBrand.carBrandId)
        })
      })
      if (this.brandsResult.length) {
        return this.brandsResult
      } else {
        this.$vux.toast.text('请至少选择一个品牌', 'middle')
      }
    },
    search(value) {
      this.searchList = []
      value && this.letterList.forEach((letter) => {
        letter.carBrandList.forEach((carBrand) => {
          // 由于引用相同,所以结算时可以值计算letterList即可
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
@import '../styles/sup.less';
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
      max-height: 85vh;
      .flex(1);
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