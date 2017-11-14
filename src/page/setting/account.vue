<template>
  <div class="c-account">
    <x-header :left-options="{preventGoBack:true,showBack:false}" :right-options="{showMore:false}" title="账号">
      <div slot="overwrite-left" @click="$router.push({name: 'setting'})">
        <i slot="icon" class="fa fa-chevron-left fa-lg"></i>
      </div>
    </x-header>
    <group>
      <cell title="登录用户名" value="213312"></cell>
      <cell title="账号角色" value="普通员工"></cell>
    </group>
    <group>
      <cell title="修改密码" value="30天未更换" isLink link="/pwdChange"></cell>
    </group>
    <group>
      <cell title="负责的业务范围" value="2个品牌" isLink link="/businessScope"></cell>
    </group>
    <x-button plain>
      <div style="color:red;">退出登录</div>
    </x-button>
  </div>
</template>

<script>
import { XHeader, Group, Cell, XButton } from 'vux'
export default {
  data() {
    return {
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
  },
  components: {
    scroll,
    XHeader,
    Cell,
    Group,
    XButton
  }
}
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-account {
  overflow: hidden;
  .c-body {
    overflow: auto;
    height: calc(~"100vh - @{vux-header-height}");
  }
}
</style>