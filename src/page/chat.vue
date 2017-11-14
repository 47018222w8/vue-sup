<template>
  <div>
    <x-header :left-options="{showBack:false}" :right-options="{showMore:false}" @on-click-more="showMenus = true" title="找件儿"></x-header>
  </div>
</template>
<script>
import { XHeader } from 'vux'
export default {
  components: {
    XHeader
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      let url = 'ws://localhost:9091/sup/v1/websocket'
      // 打开websocket
      let sock = new WebSocket(url)
      // 处理连接事件
      sock.onopen = function () {
        console.log('连接')
        sock.send('开始连接')
      }
      // 处理信息
      sock.onmessage = function (e) {
        console.log('接收信息')
        console.log(e)
        setTimeout(function () {
          sock.send('发送信息')
        }, 100000)
      }
      // 处理关闭事件
      sock.onclose = function () {
        console.log('关闭连接')
      }
    }
  }
}
</script>

