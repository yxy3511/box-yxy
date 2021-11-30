<template>
  <div class='components-box'>
    <div class="title">
      yxy3511
    </div>
    <side-menu></side-menu>
    <hello-world></hello-world>
    <router-view/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style lang='stylus'>
.components-box
  .title
    background #333
    color #fff
    display flex
    align-items center
    justify-content center
    height 70px
</style>
