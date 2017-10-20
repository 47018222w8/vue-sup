<template>
  <div class="s-header">
    <div  class="h-left" >
      <i v-if="leftIcon" @click="back" class="fa fa-angle-left fa-lg"></i>
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
    title: {
      type: String,
      default: '找件儿'
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
.s-header {
  display: flex;
  width: 100%;
  height: 40px;
  color: white;
  background: #badfaf;
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