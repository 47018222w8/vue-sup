<template>
  <div class="s-header">
    <div class="h-left">
      <i class="fa fa-angle-left fa-lg"></i>
    </div>
    <div class="h-middle">{{title}}</div>
    <div class="h-right">
      <i class="fa fa-ellipsis-v fa-lg"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 's-header',
  props: {
    title: ''
  }
}
</script>

<style scoped lang="less">
.s-header {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  color: white;
  background: @s-primary-color;
}

.s-header .h-middle {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.s-header .h-left {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 10%;
}

.s-header .h-right {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 10%;
}
</style>