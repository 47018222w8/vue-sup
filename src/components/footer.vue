<template>
  <div class="s-footer">
    <div class="f-cell" @click="toPage('quoteList')" :class="{'f-active':selectedTabBar('quoteList')}">
      <i class="fa fa-home fa-lg"></i>首页
    </div>
    <div class="f-cell" @click="toPage('chat')" :class="{'f-active':selectedTabBar('chat')}">
      <i slot="icon" class="fa fa-comment-o fa-lg" ></i>消息
    </div>
    <div class="f-cell" @click="toPage('userCenter')" :class="{'f-active':selectedTabBar('userCenter')}">
      <i slot="icon" class="fa fa-user-o fa-lg"></i>我的
    </div>
  </div>
</template>

<script>
export default {
  name: 's-footer',
  methods: {
    selectedTabBar(str) {
      return this.$route.name === str
    },
    toPage(str) {
      this.$router.push({
        name: str
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '../styles/sup.less';
.s-footer {
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: @s-footer-height;
  background: #FFFFFF;
  z-index: 100;
  font-size: 12px;
  color: #A1A1A1;
}

.s-footer {
  .f-cell {
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
  .f-active {
    color: #2196f3;
  }
}
</style>