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
    <div class="c-body">
      <group gutter="0" label-width="4.5em" label-margin-right="2em" label-align="left">
        <cell title="账号" value="123" value-align="left"></cell>
        <x-input ref="phone" title="旧密码" :max="11" v-model="formData.oldPwd"></x-input>
        <x-input ref="phone" title="新密码" :max="11" v-model="formData.newPwd"></x-input>
        <x-input ref="phone" title="确认密码" :max="11" v-model="formData.newPwdConfirm"></x-input>
      </group>
      <flexbox>
        <flexbox-item>
          <p style="font-size:16px;padding-left:10px;" class="s-p-desc">密码至少6个字符</p>
        </flexbox-item>
        <flexbox-item>
          <p style="color:#0091EA;font-size:16px;padding-right:10px;text-align:right;">忘记密码?</p>
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