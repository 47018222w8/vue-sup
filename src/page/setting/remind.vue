<template>
  <div class="c-remind">
    <x-header :left-options="{showBack:false}" :right-options="{showMore:false}" title="提醒通知设置">
      <div slot="overwrite-left" @click="$router.push({name:'setting'})">
        <i slot="icon" class="fa fa-chevron-left fa-lg"></i>
      </div>
    </x-header>
    <div class="c-body" v-if="remind">
      <group gutter="0">
        <x-switch title="接收电话通知" v-model="remind.isPhone" :value-map="[0,1]" @on-change="subRemind"></x-switch>
        <x-switch title="接收短信消息通知" v-model="remind.isSms" :value-map="[0,1]" @on-change="subRemind"></x-switch>
        <x-switch title="接收微信消息通知" v-model="remind.isWechat" :value-map="[0,1]" @on-change="subRemind"></x-switch>
        <cell title="接收电话/短信的电话号码" :value="remind.phone" is-link link="/remindPhone"></cell>
      </group>
      <!-- <group title="收到聊天消息时">
        <x-switch title="接收微信消息通知" v-model="remind.chat.wechat"></x-switch>
      </group> -->
    </div>
  </div>
</template>

<script>
  import { XHeader, Flexbox, FlexboxItem, Group, Cell, XSwitch } from 'vux'
  export default {
    data() {
      return {
        remind: null
      }
    },
    created() {
      this._initData()
    },
    methods: {
      async _initData() {
        await this.$http.get('/supSets/0').then((response) => {
          this.remind = response.data
        })
      },
      subRemind(value) {
        this.$http.put('/supSets/0', this.remind).then((response) => {
          value ? this.$vux.toast.show({ text: '启用成功' }) : this.$vux.toast.show({ text: '取消成功' })
        })
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
.c-remind {
  overflow: hidden;
  .c-body {
    overflow: auto;
    height: calc(~"100vh - @{vux-header-height}");
    background-color: @s-background-color;
  }
}
</style>