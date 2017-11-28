<template>
  <div class="c-sale-man">
    <x-header :left-options="{preventGoBack:true}" :right-options="{showMore:false}" title="客户管理">
      <div slot="overwrite-left" @click="$router.push({name: 'shop'})">
        <i slot="icon" class="fa fa-chevron-left fa-lg"></i>
      </div>
    </x-header>
    <tab>
      <tab-item selected @on-item-click="changTab">全部</tab-item>
      <tab-item @on-item-click="changTab">熟客</tab-item>
      <tab-item @on-item-click="changTab">新客</tab-item>
      <tab-item @on-item-click="changTab">潜在客户</tab-item>
    </tab>
    <div class="c-body">
      <swipeout>
        <swipeout-item transition-mode="follow">
          <div slot="right-menu">
            <swipeout-button>禁用</swipeout-button>
            <swipeout-button type="warn">删除</swipeout-button>
          </div>
          <div slot="content">
            <flexbox>
              <flexbox-item :span="1">
                <p style="text-align:center;">
                  <i class="fa fa-user" style="color:red;"></i>
                </p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
              </flexbox-item>
              <flexbox-item>
                <p class="s-div-bottom-border">车益佰车管家·益达店</p>
                <flexbox>
                  <flexbox-item :span="8">
                    <p class="s-p-desc">最近一次采购时间</p>
                  </flexbox-item>
                  <flexbox-item>
                    <p>2017-11-8</p>
                  </flexbox-item>
                </flexbox>
                <flexbox>
                  <flexbox-item :span="8">
                    <p class="s-p-desc">最近一次采购金额</p>
                  </flexbox-item>
                  <flexbox-item>
                    <p>¥3900.00</p>
                  </flexbox-item>
                </flexbox>
              </flexbox-item>
              <flexbox-item :span="1">
                <i class="fa fa-angle-right fa-lg"></i>
              </flexbox-item>
            </flexbox>
          </div>
        </swipeout-item>
        <swipeout-item class="s-div-block" transition-mode="follow">
          <div slot="right-menu">
            <swipeout-button>禁用</swipeout-button>
            <swipeout-button type="warn">删除</swipeout-button>
          </div>
          <div slot="content">
            <br>
            <flexbox>
              <flexbox-item :span="1">
                <p style="text-align:center;">
                  <i class="fa fa-user" style="color:red;"></i>
                </p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
              </flexbox-item>
              <flexbox-item>
                <p class="s-div-bottom-border">车益佰车管家·益达店</p>
                <flexbox>
                  <flexbox-item :span="8">
                    <p class="s-p-desc">最近一次采购时间</p>
                  </flexbox-item>
                  <flexbox-item>
                    <p>2017-11-8</p>
                  </flexbox-item>
                </flexbox>
                <flexbox>
                  <flexbox-item :span="8">
                    <p class="s-p-desc">最近一次采购金额</p>
                  </flexbox-item>
                  <flexbox-item>
                    <p>¥3900.00</p>
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
import { XHeader, XButton, Flexbox, FlexboxItem, CheckIcon, Swipeout, SwipeoutItem, SwipeoutButton, Tab, TabItem } from 'vux'
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
  },
  methods: {
    changTab(index) {
      console.log(index)
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
    SwipeoutButton,
    Tab,
    TabItem
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
    height: calc(
      ~"100vh - @{vux-header-height} - @{vux-tab-height}"
    );
  }
}
</style>