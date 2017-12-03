<template>
  <div class="c-account">
    <x-header :left-options="{preventGoBack:true,showBack:false}" :right-options="{showMore:false}" title="账号">
      <div slot="overwrite-left" @click="$router.push({name: 'setting'})">
        <i slot="icon" class="fa fa-chevron-left fa-lg"></i>
      </div>
    </x-header>
    <div class="c-body">
      <group gutter="0">
        <cell title="登录用户名" value="213312"></cell>
        <cell title="账号角色" value="普通员工"></cell>
      </group>
      <group :gutter="10">
        <cell title="修改密码" value="30天未更换" isLink link="/pwdChange"></cell>
      </group>
      <group :gutter="10">
        <cell title="负责的业务范围" value="2个品牌" isLink link="/businessScope"></cell>
      </group>
      <br>
      <x-button :disabled="loading" :show-loading="loading" @click.native="logout" style="width:80%;" type="primary">
        退出登录
      </x-button>
    </div>
  </div>
</template>

<script>
import { XHeader, Group, Cell, XButton } from 'vux'
import { JWT_HEADER } from '@/components/constant'
export default {
  data() {
    return {
      loading: false
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    async logout() {
      this.loading = true
      let openId = localStorage.getItem('openId')
      if (openId) {
        await this.$http.delete('/sessions?openId=' + openId).then((response) => {
        })
      }
      localStorage.removeItem(JWT_HEADER)
      this.$vux.toast.show({
        text: '注销成功',
        position: 'middle',
        time: '1300'
      })
      if (openId) {
        setTimeout(() => {
          this.$router.push({
            path: 'login',
            query: { openId: openId }
          })
        }, 1400)
      } else {
        setTimeout(() => {
          this.$router.push({
            path: 'login'
          })
        }, 1400)
      }
    }
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
    background-color: @s-background-color;
  }
}
</style>