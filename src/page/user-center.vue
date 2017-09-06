<template>
  <div>
    <card :header="{title:'我的订单'}">
      <div slot="content" class="card-demo-flex card-demo-content01">
        <div class="">
          <span>1</span>
          <br/> 待发货
        </div>
        <div class="">
          <span>15</span>
          <br/> 已完成
        </div>
        <div class="">
          <span>0</span>
          <br/> 等等等
        </div>
        <div>
          <span>88</span>
          <br/> 等等等
        </div>
      </div>
    </card>
    <divider>我是有底线的</divider>
    <s-footer></s-footer>
  </div>
</template>

<script>
import { Divider, Card } from 'vux'
import sFooter from '../components/footer'
export default {
  components: {
    Card,
    Divider,
    sFooter
  }
}
</script>

<style scoped lang="less">
.card-demo-flex {
  display: flex;
}

.card-demo-content01 {
  padding: 10px 0;
}

.card-padding {
  padding: 15px;
}

.card-demo-flex>div {
  flex: 1;
  text-align: center;
  font-size: 12px;
}

.card-demo-flex span {
  color: #f74c31;
}
</style>