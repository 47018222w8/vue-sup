<template>
  <div class="c-user-operate">
    <s-header class="c-cell" :returnName="'userCenter'" :title="'找件儿'"></s-header>
    <!-- <car-brand class="c-body"></car-brand> -->
    <div class="c-body">
      <checklist title="经营品牌" :options="operateCarBrandList" v-model="checkList"></checklist>
      <!-- <group v-if="operateCarBrandList">
                        <cell is-link v-for="(sup, index) in operateCarBrandList" :key="index" :title="sup.carBrandName">
                        </cell>
                      </group> -->
    </div>
    <div class="c-cell" v-if="operateCarBrandList.length">
      <div class="c-btn">
        <x-button mini :disabled="delDisabled" @click.native="del" type="warn">删除选中品牌</x-button>
      </div>
      <div class="c-btn">
        <x-button mini type="primary">新增经营品牌</x-button>
      </div>
    </div>
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
      checkList: []
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
      await this.$http.get('/user/operate/carBrand/list').then((response) => {
        let result = response.data
        if (result.code === 200) {
          result.data.forEach((value) => {
            this.operateCarBrandList.push({ key: value.carBrandId, value: value.carBrandName })
          })
        } else { }
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
          let sup = { carBrandIdList: _this.checkList }
          _this.$http.put('/user/operate/carBrand', sup).then((response) => {
            let result = response.data
            if (result.code === 200) {
              _this.$vux.toast.text('操作成功', 'bottom')
            } else { }
          }).catch((error) => {
            console.log(error)
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