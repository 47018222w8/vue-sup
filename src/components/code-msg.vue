<template>
  <flexbox>
    <flexbox-item>
      <input maxlength="1" v-model="currentValue" type="tel" class="c-number">
      <hr style="margin:0 auto;" width="80%">
    </flexbox-item>
    <flexbox-item>
      <input maxlength="1" type="tel" class="c-number">
      <hr style="margin:0 auto;" width="80%">
    </flexbox-item>
    <flexbox-item>
      <input maxlength="1" type="tel" class="c-number">
      <hr style="margin:0 auto;" width="80%">
    </flexbox-item>
    <flexbox-item>
      <input maxlength="1" type="tel" class="c-number">
      <hr style="margin:0 auto;" width="80%">
    </flexbox-item>
  </flexbox>
</template>

<script>
import { Flexbox, FlexboxItem } from 'vux'
export default {
  data() {
    return {
      currentA: this.a,
      currentB: this.b,
      currentC: this.c,
      currentD: this.d
    }
  },
  props: {
    a: [String, Number],
    b: [String, Number],
    c: [String, Number],
    d: [String, Number]
  },
  methods: {
  },
  watch: {
    a(val) {
      this.currentA = val
    },
    b(val) {
      this.currentA = val
    },
    c(val) {
      this.currentA = val
    },
    d(val) {
      this.currentA = val
    },
    currentA(newVal) {
      this.$emit('input', newVal)
    },
    currentB(newVal) {
      this.$emit('input', newVal)
    },
    currentC(newVal) {
      this.$emit('input', newVal)
    },
    currentD(newVal) {
      this.$emit('input', newVal)
    }
  },
  components: {
    Flexbox,
    FlexboxItem
  }
}
</script>

<style scoped lang="less">
@import "../styles/sup.less";
.c-number {
  outline: none;
  border: none;
  font-size: 30px;
  text-align: center;
  width: 100%;
  font-weight: 700;
}
</style>