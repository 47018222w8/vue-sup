<template>
  <div class="c-header">
    <div class="c-left">
      <i v-if="leftIcon" @click="back" class="fa fa-angle-left fa-lg"></i>
    </div>
    <div class="c-middle">
      <template v-if="title">
        {{title}}
      </template>
      <template v-else>
        <slot name="title"></slot>
      </template>
    </div>
    <div class="c-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'c-header',
  props: {
    title: {
      type: String,
      default: null
    },
    returnName: '',
    leftIcon: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    back() {
      this.$router.push({
        name: this.returnName
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "../styles/sup.less";
.c-header {
  .display-flex;
  width: 100%;
  height: @s-header-height;
  background: @s-primary-color;
  .c-middle {
    .display-flex;
    .flex(auto);
    .justify-content(center);
    .align-items(center);
    .flex(0 0 85%);
  }
  .c-left {
    .display-flex;
    .justify-content(center);
    .align-items(center);
    .flex(0 0 5%);
  }
  .c-right {
    .display-flex;
    .justify-content(center);
    .align-items(center);
    .flex(0 0 10%);
  }
}
</style>