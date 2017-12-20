<template>
  <div class="c-sale-man">
    <x-header :left-options="{preventGoBack:true, showBack:false}" :right-options="{showMore:false}" title="业务员管理">
      <div slot="left" @click="$router.push({name: 'shop'})">
        <i slot="icon" class="fa fa-chevron-left fa-lg"></i>
      </div>
      <div slot="right" @click="$router.push({name: 'saleManAdd'})">新增业务员</div>
    </x-header>
    <div class="c-body">
      <load-more v-show="tipShow" :show-loading="loadingMore" :tip="tipText" background-color="#fbf9fe"></load-more>
      <swipeout>
        <p class="s-p-desc" style="padding-left:5px;">
          <i class="fa fa-info-circle"></i>左划可删除业务员(一个店只能有一个管理员)</p>
        <swipeout-item class="s-div-block" transition-mode="follow" v-for="(item, index) in sonList" :key="index">
          <div slot="right-menu">
            <swipeout-button type="warn" @click.native="delSon(index)">删除</swipeout-button>
          </div>
          <div slot="content" @click="toInfo(index)">
            <flexbox align="center">
              <flexbox-item :span="1">
                <p style="text-align:center;">
                  <i class="fa fa-user-o" style="color:red;"></i>
                </p>
              </flexbox-item>
              <flexbox-item>
                <flexbox class="s-div-bottom-border">
                  <flexbox-item :span="3">
                    <p>{{item.name}}</p>
                  </flexbox-item>
                  <flexbox-item>
                    <p>业务员</p>
                  </flexbox-item>
                </flexbox>
                <flexbox class="s-div-bottom-border">
                  <flexbox-item :span="3">
                    <p>登录账号</p>
                  </flexbox-item>
                  <flexbox-item>
                    <p>{{item.uname}}</p>
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
  import { XHeader, XButton, Flexbox, FlexboxItem, CheckIcon, Swipeout, SwipeoutItem, SwipeoutButton, LoadMore } from 'vux'
  import { CHANGE_LOADING } from '@/store/mutation-type'
  export default {
    data() {
      return {
        ins: {},
        sonList: [],
        loadingMore: true,
        tipShow: true,
        tipText: '加载中...'
      }
    },
    created() {
      this._initData()
    },
    methods: {
      async _initData() {
        await this.$http.get('/members/sons', { params: { disabled: '1' } }).then((response) => {
          if (response.data.length) {
            this.sonList = response.data
            this.loadingMore = false
            this.tipShow = false
          } else {
            this.loadingMore = false
            this.tipText = '无业务员'
          }
        })
      },
      // 删除
      delSon(index) {
        this.$store.commit(CHANGE_LOADING, { isLoading: true })
        this.$http.put('/members/sons', { memberId: this.sonList[index].memberId, disabled: '0' }).then((response) => {
          this.sonList.splice(index, 1)
          this.$store.commit(CHANGE_LOADING, { isLoading: false })
        })
      },
      // 经营范围页
      toInfo(index) {
        this.$router.push({ name: 'businessScope', params: { memberId: this.sonList[index].memberId } })
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
      LoadMore,
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