<template>
  <div class="c-login">
    <div class="c-input">
      <group>
        <x-input title="账号" :max="11" type="text" v-model="formData.uname"></x-input>
        <x-input title="密码" :max="12" :type="pwdShow?'text':'password'" v-model="formData.password">
          <i @click="showPwd" slot="right" :class="pwdShow?'fa fa-eye-slash fa-lg':'fa fa-eye fa-lg'"></i>
        </x-input>
      </group>
      <br>
      <x-button :text="loading?'登录中...':'供应商登录'" :disabled="loading" @click.native="submitForm" :show-loading="loading" type="primary"></x-button>
      <div class="c-small-desc">
        <p @click="$router.push({name: 'registerPhone'})">快速注册</p>
        <p @click="$router.push({name: 'pwdFind'})">忘记密码?</p>
      </div>
    </div>
    <a :href="csTel" style="font-size:14px;color:black;">登录遇到问题?</a>
  </div>
</template>

<script>
  import { JWT_TOKEN_HEAD, JWT_HEADER, CUSTOMER_SERVICE_TEL } from '@/components/constant'
  import { XInput, Group, XButton, Cell } from 'vux'
  import { QUOTE_LIST_KEEP_ALIVE } from '@/store/mutation-type'
  import axios from 'axios'
  export default {
    name: 'Login',
    components: {
      XInput,
      Group,
      XButton,
      Cell
    },
    data() {
      return {
        formData: {
          uname: '',
          password: '',
          openId: ''
        },
        loading: false,
        pwdShow: false,
        message: '',
        toast: false,
        csTel: 'tel:' + CUSTOMER_SERVICE_TEL
      }
    },
    created() {
      let openId = localStorage.getItem('openId')
      localStorage.clear()
      if (openId) {
        localStorage.setItem('openId', openId)
        this.formData.openId = openId
      }
      this.$store.commit(QUOTE_LIST_KEEP_ALIVE, { keepAlive: false })
    },
    methods: {
      async submitForm() {
        if (this.validate() && !this.loading) {
          this.loading = true
          await this.$http.post('/noIntercept/sessions', this.formData).then((response) => {
            localStorage.setItem(JWT_HEADER, JWT_TOKEN_HEAD + response.data.token)
            axios.defaults.headers.common[JWT_HEADER] = JWT_TOKEN_HEAD + response.data.token
            this.$vux.toast.show({
              text: '登录成功',
              position: 'middle',
              time: '1400'
            })
            setTimeout(() => {
              this.$router.push({
                name: 'quoteList'
              })
            }, 1400)
          }).catch((error) => {
            let result = error.response
            result.status === 401 && this.$vux.alert.show({
              title: '提示',
              content: result.data.message
            })
            this.loading = false
          })
        }
      },
      showPwd() {
        this.pwdShow ? this.pwdShow = false : this.pwdShow = true
      },
      validate() {
        if (this.formData.uname.trim() === '') {
          this.$vux.toast.show({
            text: '请输入用户名',
            type: 'text'
          })
          return false
        } else if (this.formData.password.trim() === '') {
          this.$vux.toast.show({
            text: '请输入密码',
            type: 'text'
          })
          return false
        } else {
          return true
        }
      }
    }

  }
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-login {
  .display-flex;
  .flex-direction(column);
  .align-items(center);
  .justify-content(space-between);
  height: 100vh;
  background-color: @s-background-color;
  .c-input {
    margin-top: 20%;
    width: 90%;
  }
  .c-small-desc {
    .display-flex;
    .justify-content(space-between);
    p {
      color: @s-primary-color;
      margin: 5px 5px;
    }
  }
}
</style>