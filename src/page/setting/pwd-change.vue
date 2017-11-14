<template>
  <div class="c-pwd-change">
    <x-header :left-options="{preventGoBack:true,showBack:false}" :right-options="{showMore:false}" title="修改密码">
      <div slot="left" @click="$router.push({name: 'account'})">
        取消
      </div>
      <div class="s-p-desc" slot="right" @click="done">
        完成
      </div>
    </x-header>
    <group label-width="4.5em" label-margin-right="2em" label-align="right">
      <cell title="账号" value="123" value-align="left"></cell>
      <x-input ref="phone" title="旧密码" :max="11" v-model="formData.oldPwd"></x-input>
      <x-input ref="phone" title="新密码" :max="11" v-model="formData.newPwd"></x-input>
      <x-input ref="phone" title="确认密码" :max="11" v-model="formData.newPwdConfirm"></x-input>
    </group>
    <p style="font-size:16px;" class="s-p-desc">密码至少6个字符</p>
    <p style="color:#0091EA;font-size:16px;">忘记密码?</p>
  </div>
</template>

<script>
import { XHeader, XInput, Group, Cell } from 'vux'
export default {
  data() {
    return {
      uname: '我是账号',
      formData: {
        oldPwd: '',
        newPwd: '',
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
    }
  },
  components: {
    scroll,
    XHeader,
    XInput,
    Group,
    Cell
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
  }
}
</style>