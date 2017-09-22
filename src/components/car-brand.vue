<template>
  <div class="c-car-brand">
    <div class="c-header">
      <div class="c-icon">
        <i class="fa fa-angle-left fa-2x"></i>
      </div>
      <div class="c-cell">
        <search @on-focus="showIndex = 1" @on-cancel="showIndex = 0" @on-change="search" :autoFixed="false">
        </search>
      </div>
      <div class="c-icon"></div>
    </div>
    <div class="c-body" v-show="showIndex===0">
      <scroll class="c-left" ref="scrollLeft" :click="true" :data="letterList">
        <div ref="brandDiv">
          <checklist class="brandHeight" v-for="(letter, lIndex) in letterList" :title="letter.character" :key="lIndex" :options="letter.carBrandList"></checklist>
          <!--
                          <group v-for="(letter, lIndex) in letterList" :title="letter.character" :key="lIndex" class="brandHeight">
                            <cell is-link v-for="(carBrand, index) in letter.carBrandList" :key="index" :title="carBrand.carBrandName" @click.native="toQuotePage(index)">
                              <img slot="icon" height="30" style="display:block;margin-right:5px;" :src="carBrand.brandLogo">
                            </cell>
                          </group> -->
        </div>
      </scroll>
      <div class="c-right">
        <ul>
          <li @click="goToLetter(lIndex)" v-for="(letter, lIndex) in letterList" :key="lIndex">{{letter.character}}</li>
        </ul>
      </div>
    </div>
    <div class="c-body" v-show="showIndex===1">
      <scroll :data="searchList">
        <div ref="brandDiv">
          <checklist :options="searchList"></checklist>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import constant from '../components/constant'
import { Divider, Cell, Group, Tab, TabItem, Search, Checklist } from 'vux'
import scroll from '../components/scroll'
export default {
  data() {
    return {
      letterList: [],
      brandHeights: [],
      showIndex: 0,
      searchList: []
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
    Checklist
  },
  created() {
    this._initData()
  },
  methods: {
    async _initData() {
      await this.$http.get('/user/car/brand').then((response) => {
        let result = response.data
        if (result.code === 200) {
          this.letterList = result.data
        } else {
          this.$router.push({
            name: 'error'
          })
        }
        setTimeout((e) => {
          this._calculateHeight()
        }, 200)
      })
    },
    search(value) {
      this.searchList = []
      value && this.letterList.forEach((letter) => {
        letter.carBrandList.forEach((carBrand) => {
          carBrand.value.indexOf(value) !== -1 && this.searchList.push(carBrand)
        })
      })
    },
    change() {
      console.log(111)
    },
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
  }
}
</script>

<style scoped lang="less">
.c-car-brand {
  display: flex;
  flex-direction: column;
  .c-header {
    flex: none;
    display: flex;
    background-color: @search-bg-color;
    .c-cell {
      flex: auto;
    }
    .c-icon {
      display: flex;
      flex: 0 0 5%;
      align-items: center;
      justify-content: center;
      color: @search-placeholder-font-color;
    }
  }
  .c-body {
    flex: none;
    display: flex;
    overflow: hidden;
    .c-left {
      flex: 1;
    }
    .c-right {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 10px;
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