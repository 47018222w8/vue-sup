<template>
  <div>
    <card :header="{title:'我的订单'}">
      <div slot="content" class="card-demo-flex card-demo-content01">
        <div>
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
    <card :header="{title:'设置'}">
      <div slot="content" class="card-demo-flex card-demo-content01">
        <div @click="toPage('userOperate')">
          <i class="fa fa-automobile fa-2x"></i>
          <br/> 经营范围
        </div>
        <div>
          <i class="fa fa-vcard fa-2x"></i>
          <br/> 报价联系人
        </div>
        <div>
          <i class="fa fa-users fa-2x"></i>
          <br/> 子账户管理
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
  },
  methods: {
    toPage(name) {
      this.$router.push({
        name: name
      })
    }
  }
}
</script>

<style lang="less">
.card-demo-flex {
  display: flex;
  >div {
    flex: 1;
    text-align: center;
    font-size: 12px;
  }
  span {
    color: #f74c31;
  }
  i {
    color:#A1A1A1;
  }
}

.card-demo-content01 {
  padding: 10px 0;
}
</style>