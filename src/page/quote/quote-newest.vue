<template>
  <div class="c-newest-quote">
    <p class="c-first-title">您尚有9张询价单未处理</p>
    <div class="c-body">
      <card class="c-card">
        <div class="c-card-header" slot="header">
          <div class="c-left">
            <div class="c-square">1</div>
            <p style="padding-left:10px;">单号:</p>
            <p class="c-ins-number">qvgqweqweqwejkljkl</p>
          </div>
          <p class="s-p-desc c-right">待报价</p>
        </div>
        <div slot="content">
          <div class="c-card-repair">
            <div class="c-left">
              <div class="c-title">
                <h5 class="c-second-title">{{ins.entMemberName}}</h5><p style="color:red">催单两次</p>
              </div>
              <p class="s-p-desc">信誉度:良好</p>
              <p class="s-p-desc">{{ins.address}}</p>
            </div>
            <div class="c-right">
              <i slot="icon" style="margin-right:25px;" class="fa fa-envelope fa-2x"></i>
              <i slot="icon" class="fa fa-mobile fa-2x"></i>
            </div>
          </div>
          <hr class="c-hr" />
          <h5 class="c-second-title">{{ins.carBrandName}}</h5>
          <p class="s-desc">{{ins.vin?ins.vin:'暂无车架号'}}</p>
          <div class="c-img">
            <div class="c-img-cell">
              <img src="http://img1.gamersky.com/image2017/10/20171019_zy_164_6/image003.jpg" width="80px" alt="">
            </div>
            <div class="c-img-cell">
              <img src="http://img1.gamersky.com/image2017/10/20171019_zy_164_6/image003.jpg" width="80px" alt="">
            </div>
            <div class="c-img-cell">
              <img src="http://img1.gamersky.com/image2017/10/20171019_zy_164_6/image003.jpg" width="80px" alt="">
            </div>
          </div>
          <hr class="c-hr" />
          <h5 class="c-second-title">零部件({{partList.length}})</h5>
          <p class="s-desc">{{ins.isInvoice?'需要发票':'不需要发票'}}</p>
          <p class="s-desc">{{ins.arriveTimeStr}}前到货</p>
          <flexbox v-for="(item, index) in partList" :key="index">
            <flexbox-item>
              <p class="c-p">{{item.name}}</p>
            </flexbox-item>
            <flexbox-item>
              <p class="c-p">品质</p>
            </flexbox-item>
            <flexbox-item>
              <p class="c-p">*1</p>
            </flexbox-item>
          </flexbox>
        </div>
      </card>
    </div>
    <div class="c-footer">
      <div class="c-left">
        <x-button>忽略</x-button>
      </div>
      <div class="c-right">
        <x-button @click.native="toQuotePage" type="primary">接单并开始报价</x-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, Divider, Cell, Group, Tab, TabItem, Badge, Actionsheet, XHeader, XTable, Card, XButton, ButtonTab, ButtonTabItem } from 'vux'
export default {
  data() {
    return {
      ins: {},
      insId: this.$route.params.insId,
      partList: {}
    }
  },
  created() {
    this._initData()
  },
  methods: {
    async _initData() {
      await this.$http.get('/insruances/' + this.insId, { params: { state: '0' } }).then((response) => {
        let quote = response.data
        // 询价单信息
        let ins = quote.ins
        ins.rearImg && quote.domain + ins.rearImg
        ins.frontImg && quote.domain + ins.frontImg
        ins.driveLicense && quote.domain + ins.driveLicense
        this.ins = ins
        this.partList = quote.reportPriceList
      })
    },
    toQuotePage() {
      if (!this.ins.isRead) {
        let rpe = {
          insId: this.insId,
          isRead: 1
        }
        this.$http.put('/reportPriceExtends', rpe).then((response) => {
          this.$router.push({
            name: 'quote',
            params: {
              insId: this.insId
            }
          })
        })
      } else {
        this.$router.push({
          name: 'quote',
          params: {
            insId: this.insId
          }
        })
      }
    }
  },
  components: {
    Cell,
    Group,
    Tab,
    TabItem,
    scroll,
    Divider,
    Flexbox,
    FlexboxItem,
    Badge,
    Actionsheet,
    XHeader,
    XTable,
    Card,
    XButton,
    ButtonTab,
    ButtonTabItem
  }
}
</script>

<style scoped lang="less">
@import "../../styles/sup.less";
@c-left-right: 15px;
@c-first-title-height: 48px;
.c-newest-quote {
  .display-flex;
  .flex-direction(column);
  .c-p {
    text-align: center;
  }
  .c-first-title {
    font-size: @s-p-first-size;
    padding-left: 34px;
  }
  .c-second-title {
    font-size: @s-p-second-size;
    margin-right: 15px;
  }
  overflow: hidden;
  .c-body {
    padding-left: @c-left-right;
    padding-right: @c-left-right;
    .c-card {
      padding-left: @c-left-right;
      padding-right: @c-left-right;
    }
    .c-hr {
      margin: 15px 0 15px 0;
    }
    .flex(none);
    overflow: auto;
    height: calc(
      ~"100vh - @{vux-header-height} - @{s-footer-height} - @{vux-button-height} - 68px"
    );
    .c-card-header {
      .display-flex;
      margin-bottom: 20px;
      .c-left {
        .flex(0 0 80%);
        .display-flex;
        .align-items(center);
        .c-square {
          background-color: @s-primary-color;
          color: #fff;
          width: 25px;
          height: 25px;
          text-align: center;
        }
        .c-end {
          align-self: flex-end;
        }
        .c-ins-number {
          padding-left: 15px;
          color: @s-primary-color;
          padding-left: 10px;
        }
      }
    }
  }
  .c-footer {
    .display-flex;
    height: @vux-button-height;
    .c-left {
      .display-flex;
      .flex(0 0 20%);
    }
    .c-right {
      .display-flex;
      .flex(auto);
    }
  }
  .c-cell {
    .flex(none);
  }
  .c-card-repair {
    .display-flex;
    .c-left {
      .flex(auto);
      .c-title {
        .display-flex;
        .align-items(center);
      }
    }
    .c-right {
      .display-flex;
      .flex(0 0 30%);
      .align-items(center);
    }
  }
  .c-img {
    .display-flex;
    .justify-content(center);
    .c-img-cell {
      .flex(0 0 33%);
      text-align: center;
    }
  }
  .c-cell-repair {
    .display-flex;
    .c-left {
      .flex(auto);
    }
    .c-right {
      .flex(0 0 30%);
      .display-flex;
    }
  }
}
</style>