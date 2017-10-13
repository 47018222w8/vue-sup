<template>
  <div style="text-align: center;">
    <group>
      <x-input title="账号" type="text" v-model="formData.uname"></x-input>
      <x-input title="密码" type="password" v-model="formData.password"></x-input>
      <x-button :text="loading?'登录中...':'登录'" :disabled="loading" @click.native="submitForm" :show-loading="loading" type="primary"></x-button>
    </group>

  </div>
</template>

<script>
import constant from '../components/constant'
import { XInput, Group, XButton, Cell } from 'vux'
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
        password: ''
      },
      loading: false,
      message: '',
      toast: false
    }
  },
  methods: {
    async submitForm() {
      if (this.validate()) {
        this.loading = true
        await this.$http.post('/sessions', this.formData).then((response) => {
          localStorage.setItem(constant.JWT_HEADER, constant.JWT_TOKEN_HEAD + response.data)
          axios.defaults.headers.common[constant.JWT_HEADER] = constant.JWT_TOKEN_HEAD + response.data
          this.$vux.toast.show({
            text: '登录成功',
            position: 'middle',
            time: '1200'
          })
          setTimeout(() => {
            this.$router.push({
              name: 'quoteList'
            })
          }, 1400)
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

<style>

</style>