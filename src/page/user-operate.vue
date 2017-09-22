<template>
  <div class="c-user-operate">
    <car-brand class="c-body"></car-brand>
  </div>
</template>

<script>
import sFooter from '../components/footer'
import sHeader from '../components/header'
import constant from '../components/constant'
import { Divider, Cell, Group, Tab, TabItem } from 'vux'
import carBrand from '../components/car-brand'
export default {
  data() {
    return {
      letterList: [],
      carBrandHeights: this.$store.state.carBrandHeights
    }
  },
  components: {
    sFooter,
    sHeader,
    constant,
    Divider,
    Cell,
    Group,
    Tab,
    TabItem,
    carBrand
  }
}
</script>

<style lang="less">
.c-user-operate {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .c-header {
    flex: none;
  }
  .c-body {
    flex: none;
    height: 100vh;
  }
}
</style>