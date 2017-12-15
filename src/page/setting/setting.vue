<template>
  <div class="c-setting">
    <x-header :left-options="{preventGoBack:true,showBack:false}" :right-options="{showMore:false}" title="设置">
    </x-header>
    <div class="c-body" v-if="member">
      <group gutter="0">
        <cell title="账号" :value="member.uname" is-link link="/account"></cell>
        <cell title="提醒通知设置" is-link link="/remind"></cell>
      </group>
      <group :gutter="10">
        <cell title="呼叫客服" >
          <div slot="default">
            <a href="tel:13364473978"><i style="color:#2196F3" class="fa fa-user-circle fa-lg"></i></a>
          </div>
        </cell>
        <cell title="投诉建议" is-link></cell>
        <cell title="关于我们" is-link></cell>
      </group>
      <group :gutter="10">
        <flexbox>
          <flexbox-item :span="1" style="text-align:center;">
            <i style="color:red;" class="fa fa-volume-control-phone fa-lg"></i>
          </flexbox-item>
          <flexbox-item>
            <x-switch title="接单中" inline-desc="您可正常接收到客户的询价单" v-model="demo1"></x-switch>
          </flexbox-item>
        </flexbox>
      </group>
    </div>
  </div>
</template>

<script>
  import { XHeader, Flexbox, FlexboxItem, Group, Cell, XSwitch } from 'vux'
  export default {
    data() {
      return {
        showPart: true,
        demo1: true,
        member: null
      }
    },
    created() {
      this.getMember()
    },
    methods: {
      async getMember() {
        await this.$http.get('/member').then((response) => {
          this.member = response.data
        })
      },
      changTab(index) {
        console.log(index)
      }
    },
    components: {
      scroll,
      XHeader,
      Flexbox,
      FlexboxItem,
      Group,
      Cell,
      XSwitch
    }
  }
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-setting {
  overflow: hidden;
  .c-body {
    overflow: auto;
    height: calc(~"100vh - @{vux-header-height}");
    background-color: @s-background-color;
  }
}
</style>