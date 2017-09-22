<template>
  <div class="s-header">
    <div class="h-left" @click="back">
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
    title: '',
    returnName: ''
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
.s-header {
  display: flex;
  width: 100%;
  height: @s-header-height;
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