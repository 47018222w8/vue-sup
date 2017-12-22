<template>
  <div class="c-register">
    <x-header :left-options="{preventGoBack:true, showBack: false}" :right-options="{showMore:false}" title="注册">
      <div slot="left" @click="$router.push({name: 'login'})">
        <i slot="icon" class="fa fa-times fa-lg"></i>
      </div>
    </x-header>
    <div class="c-body" v-if="formData">
      <p class="s-second-title" style="text-align:center;">设置登录密码和昵称</h3>
        <group title="您填写的信息只用于注册，我们会严格保密，请放心填写" label-width="5em" label-margin-right="2em" label-align="right">
          <x-input title="企业名称" :max="50" placeholder="同营业执照一致" v-model="formData.storeName"></x-input>
          <x-input title="企业法人" :max="50" placeholder="同营业执照一致" v-model="formData.contacter"></x-input>
          <x-address v-model="region" title="所属省市区"  value-text-align="left" :list="addressData" placeholder="请选择企业所在的区域"></x-address>
          <x-input title="详细地址" :max="50" placeholder="请填写详细地址" v-model="formData.attr"></x-input>
        </group>
        <br>
        <div class="imgDiv">
          <label for="img0">
            <p class="s-p-desc" style="padding-top:10px;">请上传您的营业执照正面</p>
            <i slot="icon" v-show="!imgShow" class="fa fa-camera fa-4x s-p-desc" style="padding-bottom:20px;"></i>
            <img v-show="imgShow" :src="imgSrc" width="80px" alt="">
          </label>
          <input id="img0" type="file" ref="img" accept="image/png,image/jpeg,image/jpg" @change="uploadImg">
        </div>
    </div>
    <div class="s-footer-btn">
      <x-button style="width:80%" :text="loading?'加载中...':'提交'" :disabled="loading" @click.native="subForm" :show-loading="loading" type="primary"></x-button>
    </div>
  </div>
</template>

<script>
  import { XHeader, XButton, Group, XInput, Flexbox, FlexboxItem, Actionsheet, Checklist, XAddress, Msg } from 'vux'
  import { REGISTER_DATA } from '@/store/mutation-type'
  export default {
    data() {
      return {
        // 所有大按钮加载判断
        loading: false,
        formData: null,
        region: ['7', '85', '908'],
        addressData: [],
        imgShow: false,
        imgSrc: ''
      }
    },
    created() {
      this.formData = JSON.parse(JSON.stringify(this.$store.state.registerData))
      this.getRegions()
    },
    methods: {
      // 获取省市区
      async getRegions() {
        await this.$http.get('/noIntercept/regions').then((response) => {
          this.addressData = response.data
        })
      },
      uploadImg() {
        /* eslint-disable no-undef */
        lrz(this.$refs.img.files[0], { quality: 0.3 })
          .then((rst) => {
            this.$http.post('/noIntercept/imgs', rst.formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
              this.imgSrc = response.data.url
              this.formData.licenseImg = response.data.path
              this.imgShow = true
            })
            return rst
          })
      },
      subForm() {
        if (!this.formData.storeName) {
          this.$vux.toast.text('请输入企业名称', 'bottom')
          return
        }
        if (!this.formData.contacter) {
          this.$vux.toast.text('请输入企业法人', 'bottom')
          return
        }
        if (!this.formData.attr) {
          this.$vux.toast.text('请填写详细地址', 'bottom')
          return
        }
        if (!this.formData.licenseImg) {
          this.$vux.toast.text('请上传营业执照', 'bottom')
          return
        }
        this.loading = true
        this.addressData.forEach(item => {
          if (item.value === this.region[0]) {
            this.formData.provinceId = item.value
            this.formData.provinceName = item.name
          }
          if (item.value === this.region[1]) {
            this.formData.cityId = item.value
            this.formData.cityName = item.name
          }
          if (item.value === this.region[2]) {
            this.formData.regionId = item.value
            this.formData.regionName = item.name
          }
        })
        this.$http.post('/noIntercept/stores', this.formData).then((response) => {
          this.$store.commit(REGISTER_DATA, null)
          this.$router.push({
            name: 'registerResult',
            params: { type: 0 }
          })
        }).catch((error) => {
          let result = error.response
          result.status === 400 && this.$vux.toast.show({
            text: result.data.message,
            type: 'warn',
            position: 'middle',
            time: '1500'
          })
          this.loading = false
        })
      }
    },
    components: {
      scroll,
      XHeader,
      XButton,
      Group,
      XInput,
      Flexbox,
      FlexboxItem,
      Actionsheet,
      Checklist,
      XAddress,
      Msg
    }
  }
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-register {
  overflow: hidden;
  .c-body {
    overflow: auto;
    height: calc(~"100vh - @{vux-header-height} - @{vux-button-div-height}");
    background-color: #fff;
    .imgDiv {
      border: 1px solid @s-desc-font-color;
      text-align: center;
      width: 60%;
      margin: 0 auto;
    }
  }
}
</style>