<template>
  <div class="c-pwd-change">
    <x-header :left-options="{preventGoBack:true,showBack:false}" :right-options="{showMore:false}" title="修改密码">
      <div slot="left" @click="$router.push({name: 'account'})">
        取消
      </div>
      <div  slot="right" @click="done">
        完成
      </div>
    </x-header>
    <div class="c-body">
      <group gutter="0" label-width="4.5em" label-margin-right="2em" label-align="left">
        <x-input title="旧密码" type="password" :max="12" v-model="formData.oldPwd"></x-input>
        <x-input title="新密码" type="password" :max="12" v-model="formData.password"></x-input>
        <x-input title="确认密码" type="password" :max="12" v-model="formData.newPwdConfirm"></x-input>
      </group>
      <flexbox>
        <flexbox-item>
          <p style="font-size:16px;padding-left:10px;" class="s-p-desc">密码至少6个字符</p>
        </flexbox-item>
        <flexbox-item>
          <p @click="$router.push({name: 'pwdFind'})" style="color:#0091EA;font-size:16px;padding-right:10px;text-align:right;">忘记密码?</p>
        </flexbox-item>
      </flexbox>
    </div>
  </div>
</template>

<script>
  import { XHeader, XInput, Group, Cell, Flexbox, FlexboxItem } from 'vux'
  export default {
    data() {
      return {
        uname: '我是账号',
        member: this.$store.state.member,
        formData: {
          oldPwd: '',
          password: '',
          newPwdConfirm: ''
        }
      }
    },
    created() {
    },
    mounted() {
    },
    methods: {
      done() {
        this.formData.password = this.formData.password.trim()
        if (!this.formData.password || this.formData.password.length < 5) {
          this.$vux.toast.text('请输入大于六位的密码', 'bottom')
          return
        }
        if (this.formData.password !== this.formData.newPwdConfirm) {
          this.$vux.toast.text('两次密码输入不一致', 'bottom')
          return
        }
        this.$http.put('/members/pwd', this.formData).then((response) => {
          this.$vux.toast.show({
            text: '修改成功',
            position: 'middle',
            time: '1400'
          })
          setTimeout(() => {
            this.$router.push({
              name: 'account'
            })
          }, 1400)
        }).catch((error) => {
          let result = error.response
          result.status === 401 && this.$vux.toast.show({
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
      XInput,
      Group,
      Cell,
      Flexbox,
      FlexboxItem
    }
  }
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-pwd-change {
  overflow: hidden;
  .c-body {
    overflow: auto;
    height: calc(~"100vh - @{vux-header-height}");
    background-color: @s-background-color;
  }
}
</style>