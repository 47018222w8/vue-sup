<template>
  <div class="c-sale-man-add">
    <x-header :left-options="{preventGoBack:true,showBack: false}" :right-options="{showMore:false}" title="业务员信息">
      <div slot="left" @click="$router.push({name: 'saleMan'})">
        取消
      </div>
      <div slot="right" @click="done">
        完成
      </div>
    </x-header>
    <div class="c-body">
      <group gutter="0" label-width="4.5em" label-margin-right="2em" label-align="right">
        <x-input title="姓名" placeholder="请输入业务员姓名" v-model="formData.name" :max="6" :required="true" placeholder-align="left"></x-input>
        <x-input title="手机" placeholder="请输入手机号码" v-model="formData.uname" :max="11" :required="true" placeholder-align="left" type="tel"></x-input>
        <x-input title="密码" placeholder="请输入登录密码" v-model="formData.password" :min="6" :max="12" :required="true" placeholder-align="left"></x-input>
      </group>
      <p style="padding-left:10px;">选择此业务员负责的业务范围</p>
      <p class="s-p-desc" style="padding-left:10px;">绿色为选中,点击可取消</p>
      <div class="s-div-block">
        <div class="s-checker-brand">
          <checker v-model="result" type="checkbox" default-item-class="s-checker-brand-default" selected-item-class="s-checker-brand-selected">
            <checker-item :value="item" v-for="(item, index) in carBrandList" :key="index">{{item.value}}</checker-item>
          </checker>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { XHeader, XButton, Flexbox, FlexboxItem, XInput, Group, Checker, CheckerItem } from 'vux'
  import { RE_PHONE } from '@/components/constant'
  export default {
    data() {
      return {
        result: [],
        carBrandList: [],
        loading: false,
        formData: {
          name: '',
          uname: '',
          password: '',
          carBrandIdList: []
        }
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
            this.result.push({ key: value.carBrandId, value: value.carBrandName })
          })
        })
      },
      done() {
        if (!this.loading) {
          if (!RE_PHONE.test(this.formData.uname)) {
            this.$vux.toast.text('请输入正确的手机号码', 'bottom')
            return
          }
          if (!this.formData.name.trim()) {
            this.$vux.toast.text('请输入姓名', 'bottom')
            return
          }
          if (!this.formData.password.trim() || this.formData.password.trim().length < 5) {
            this.$vux.toast.text('请输入至少6位密码', 'bottom')
            return
          }
          if (!this.result.length) {
            this.$vux.toast.text('请选择子账号经营范围', 'bottom')
            return
          }
          this.loading = true
          this.$vux.loading.show({
            text: '加载中'
          })
          this.result.forEach(item => this.formData.carBrandIdList.push(item.key))
          this.$http.post('/members/sons', this.formData).then((response) => {
            this.$vux.loading.hide()
            this.$vux.toast.show({
              text: '添加成功',
              position: 'middle',
              time: '1500'
            })
            setTimeout(() => {
              this.$router.push({ name: 'saleMan' })
            }, 1500)
          }).catch((error) => {
            let result = error.response
            result.status === 400 && this.$vux.toast.show({
              text: result.data.message,
              type: 'warn',
              position: 'middle',
              time: '1500'
            })
            this.$vux.loading.hide()
            this.loading = false
          })
        }
      }
    },
    components: {
      scroll,
      XHeader,
      XButton,
      Flexbox,
      FlexboxItem,
      XInput,
      Group,
      Checker,
      CheckerItem
    }
  }
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-sale-man-add {
  overflow: hidden;
  .c-body {
    overflow: auto;
    background-color: @s-background-color;
    height: calc(~"100vh - @{vux-header-height}");
  }
}
</style>