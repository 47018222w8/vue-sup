<template>
  <div class="c-remind-phone">
    <x-header :left-options="{preventGoBack:true,showBack:false}" :right-options="{showMore:false}" title="接受提醒电话号码">
      <div slot="left" @click="$router.push({name: 'remind'})">
        取消
      </div>
      <div :class="phone.length===11?'':'s-p-desc'" slot="right" @click="done">
        完成
      </div>
    </x-header>
    <div class="c-body">
      <group gutter="0">
        <x-input ref="phone" title="新电话号码" :max="11" type="tel" v-model="phone"></x-input>
      </group>
    </div>
  </div>
</template>

<script>
  import { RE_PHONE } from '@/components/constant'
  import { XHeader, XInput, Group } from 'vux'
  export default {
    data() {
      return {
        phone: ''
      }
    },
    created() {
    },
    mounted() {
      this.$refs.phone.focus()
    },
    methods: {
      done() {
        if (RE_PHONE.test(this.phone)) {
          this.$http.put('/supSets/0', {phone: this.phone}).then((response) => {
            this.$vux.toast.show({
              text: '修改成功',
              position: 'middle',
              time: '1200'
            })
            setTimeout(() => {
              this.$router.push({ name: 'remind' })
            }, 1200)
          })
        } else {
          this.$vux.toast.text('请输入正确的手机号', 'bottom')
        }
      }
    },
    components: {
      scroll,
      XHeader,
      XInput,
      Group
    }
  }
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-remind-phone {
  overflow: hidden;
  .c-body {
    overflow: auto;
    height: calc(~"100vh - @{vux-header-height}");
    background-color: @s-background-color;
  }
}
</style>