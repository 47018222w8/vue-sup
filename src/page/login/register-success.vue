<template>
  <div>
    <msg title="提交成功" icon="waiting">
      <div slot="description">
        <p class="s-p-desc">我们会在 1 个工作日内审核完成</p>
        <p class="s-p-desc">审核完成后会以短信通知您</p>
      </div>
    </msg>
  </div>
</template>

<script>
import { Msg } from 'vux'
export default {
  components: {
    Msg
  }
}
</script>

<style lang="less">
@import "../../styles/sup.less";

</style>