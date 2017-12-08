<template>
  <div>
    <msg title="提交成功" icon="waiting" :buttons="buttons">
      <div slot="description">
        <p class="s-p-desc">我们会在 1 个工作日内审核完成</p>
        <p class="s-p-desc">审核完成后会以短信通知您</p>
      </div>
    </msg>
    <x-button style="width:80%" @click.native="$router.push({name: 'login'})"></x-button>
  </div>
</template>

<script>
  import { Msg, XButton } from 'vux'
  export default {
    components: {
      Msg,
      XButton
    },
    data() {
      return {
        buttons: [{
          type: 'default',
          text: '确认',
          link: '/login'
        }]
      }
    }
  }
</script>

<style lang="less">
@import "../../styles/sup.less";
</style>