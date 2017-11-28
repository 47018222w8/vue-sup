<template>
  <div class="c-sale-man">
    <x-header :left-options="{preventGoBack:true, showBack:false}" :right-options="{showMore:false}" title="业务员管理">
      <div slot="left" @click="$router.push({name: 'shop'})">
        <i slot="icon" class="fa fa-chevron-left fa-lg"></i>
      </div>
      <div slot="right" @click="$router.push({name: 'saleManAdd'})">新增业务员</div>
    </x-header>
    <div class="c-body">
      <swipeout>
        <p class="s-p-desc" style="padding-left:5px;">
          <i class="fa fa-info-circle"></i>左划可删除业务员(一个店只能有一个管理员)</p>
        <swipeout-item class="s-div-block" transition-mode="follow">
          <div slot="right-menu">
            <swipeout-button>禁用</swipeout-button>
            <swipeout-button type="warn">删除</swipeout-button>
          </div>
          <div slot="content">
            <flexbox>
              <flexbox-item :span="1">
                <p style="text-align:center;">
                  <i class="fa fa-user-o" style="color:red;"></i>
                </p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
              </flexbox-item>
              <flexbox-item>
                <flexbox class="s-div-bottom-border">
                  <flexbox-item :span="3">
                    <p>诸葛亮</p>
                  </flexbox-item>
                  <flexbox-item>
                    <p>管理员</p>
                  </flexbox-item>
                </flexbox>
                <flexbox class="s-div-bottom-border">
                  <flexbox-item :span="3">
                    <p>登录账号</p>
                  </flexbox-item>
                  <flexbox-item>
                    <p>13333333333</p>
                  </flexbox-item>
                </flexbox>
                <flexbox class="s-div-bottom-border">
                  <flexbox-item :span="3">
                    <p>复制业务</p>
                  </flexbox-item>
                  <flexbox-item>
                    <p>all</p>
                  </flexbox-item>
                </flexbox>
              </flexbox-item>
              <flexbox-item :span="1">
                <i class="fa fa-angle-right fa-lg"></i>
              </flexbox-item>
            </flexbox>
          </div>
        </swipeout-item>
        <swipeout-item class="s-div-block"  transition-mode="follow">
          <div slot="right-menu">
            <swipeout-button>禁用</swipeout-button>
            <swipeout-button type="warn">删除</swipeout-button>
          </div>
          <div slot="content">
            <flexbox>
              <flexbox-item :span="1">
                <p style="text-align:center;">
                  <i class="fa fa-user-o" style="color:red;"></i>
                </p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
              </flexbox-item>
              <flexbox-item>
                <flexbox class="s-div-bottom-border">
                  <flexbox-item :span="3">
                    <p>赵云</p>
                  </flexbox-item>
                  <flexbox-item>
                    <p>一身都是胆</p>
                  </flexbox-item>
                </flexbox>
                <flexbox class="s-div-bottom-border">
                  <flexbox-item :span="3">
                    <p>登录账号</p>
                  </flexbox-item>
                  <flexbox-item>
                    <p>13333333333</p>
                  </flexbox-item>
                </flexbox>
                <flexbox class="s-div-bottom-border">
                  <flexbox-item :span="3">
                    <p>复制业务</p>
                  </flexbox-item>
                  <flexbox-item>
                    <p>all</p>
                  </flexbox-item>
                </flexbox>
              </flexbox-item>
              <flexbox-item :span="1">
                <i class="fa fa-angle-right fa-lg"></i>
              </flexbox-item>
            </flexbox>
          </div>
        </swipeout-item>
      </swipeout>
    </div>
  </div>
</template>

<script>
import { XHeader, XButton, Flexbox, FlexboxItem, CheckIcon, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
export default {
  data() {
    return {
      ins: {},
      reportList: {},
      showPart: true,
      demo1: true
    }
  },
  created() {
    // this._initData()
  },
  methods: {
    async _initData() {
      await this.$http.get('/insruances/' + this.$route.params.insId, { params: { state: '0' } }).then((response) => {
        let quote = response.data
        this.ins = quote.ins
        this.reportList = quote.reportPriceList
      })
    },
    changeShowPart() {
      this.showPart ? this.showPart = false : this.showPart = true
    },
    toQuotePage() {
      this.$router.push({
        name: 'quote',
        params: {
          insId: this.$route.params.insId
        }
      })
    }
  },
  components: {
    scroll,
    XHeader,
    XButton,
    Flexbox,
    FlexboxItem,
    CheckIcon,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  }
}
</script>

<style lang="less">
@import "../../styles/sup.less";
.c-sale-man {
  overflow: hidden;
  .c-body {
    overflow: auto;
    background-color: @s-background-color;
    height: calc(~"100vh - @{vux-header-height}");
  }
}
</style>