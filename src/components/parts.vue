<template>
  <div class="good">
    <div class="menu-wrapper">
      <ul style="transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1); transition-duration: 0ms; transform: translate(0px, 0px) translateZ(0px);">
        <li class="menu-item border-1px">
          <span class="text">
            <span class=" icon" style="display: none;"></span>热销榜
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'part'
}
</script>

<style>
.good {
  display: flex;
  position: absolute;
  width: 100%;
  top: 174px;
  bottom: 46px;
  overflow: hidden;
}

.menu-wrapper {
  -ms-flex: 0 0 80px;
  flex: 0 0 80px;
  width: 80px;
  background: #f3f5f7;
}

.menu-item {
  display: table;
  width: 56px;
  height: 54px;
  line-height: 14px;
  padding: 0 12px;
}

li {
  list-style: none;
}
</style>