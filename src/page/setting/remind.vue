<template>
  <div class="c-remind">
    <x-header :left-options="{preventGoBack:true,showBack:false}" :right-options="{showMore:false}" title="设置">
      <div slot="overwrite-left" @click="$router.push({name: 'setting'})">
        <i slot="icon" class="fa fa-chevron-left fa-lg"></i>
      </div>
    </x-header>
    <div class="c-body">
      <group>
        <x-switch title="开启提醒通知" v-model="remind.all"></x-switch>
      </group>
      <group title="收到询价/有新订单时">
        <x-switch title="接收电话通知" v-model="remind.normal.phone"></x-switch>
        <x-switch title="接收短信消息通知" v-model="remind.normal.message"></x-switch>
        <x-switch title="接收微信消息通知" v-model="remind.normal.wechat"></x-switch>
        <cell title="接收电话/短信的电话号码" value="133****1234" is-link link="/remindPhone"></cell>
      </group>
      <group title="收到聊天消息时">
        <x-switch title="接收微信消息通知" v-model="remind.chat.wechat"></x-switch>
      </group>
    </div>
  </div>
</template>

<script>
import { XHeader, Flexbox, FlexboxItem, Group, Cell, XSwitch } from 'vux'
export default {
  data() {
    return {
      remind: {
        all: true,
        normal: {
          phone: true,
          wechat: true,
          message: true
        },
        chat: {
          wechat: true
        }
      }
    }
  },
  created() {
  },
  methods: {
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
.c-remind {
  overflow: hidden;
  .c-body {
    overflow: auto;
    height: calc(~"100vh - @{vux-header-height}");
  }
}
</style>