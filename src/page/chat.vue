<template>
  <div>
    <s-header class="c-cell" :returnName="'home'" :leftIcon="false"></s-header>
  </div>
</template>
<script>
import sHeader from '../components/header'
import Stomp from 'stompjs'
export default {
  components: {
    sHeader
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      let url = 'http://localhost:9091/sup/marcopolo'
      /* eslint-disable */
      let socket = new SockJS(url)
      let stomp = Stomp.over(socket)
      let payload = JSON.stringify({ message: 'hello world' })
      stomp.connect('guest', 'guest', function(frame) {
        stomp.send('/app/marco', {}, payload)
      })
    }
  }
}
</script>

