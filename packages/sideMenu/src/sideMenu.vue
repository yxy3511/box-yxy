<template>
  <div class="side-menu-component">
    <div class="menu-container">
      <div class="stretch" :class="[retract ? 'retract' : '']" @click='changeRetract()'>
        &lt;&lt;
      </div>
      <div class="menu-main">
        <div class="menu-div" :class="{active: !curId, 'retract': retract}">
          <div class="menu-info" @click='setCurId(0)'>设备</div>
          <div class="menu-children">
            <div class="menu-menu-info">设备管理</div>
            <div class="menu-menu-info">上线配置</div>
          </div>
        </div>
        <div class="menu-div" :class="{active: 1 === curId, 'retract': retract}">
          <div class="menu-info" @click='setCurId(1)'>产品</div>
          <div class="menu-children">
            <div class="menu-menu-info">产品管理</div>
            <div class="menu-menu-info">产品配置</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    name: 'SideMenu',
    data() {
      return {
        curId: 0,
        retract: false
      }
    },
    methods: {
      setCurId(id) {
        this.curId = id
      },
      changeRetract() {
        this.retract = !this.retract
      }
    }
  }
</script>
<style scoped lang='stylus'>
.side-menu-component
  position fixed
  left 0
  // top 0
  height 100%
  .stretch
    width 54px
    height 54px
    border .5px solid #E8E8E8
    border-radius 50%
    background #FAFAFA
    color #000
    position absolute
    top 50%
    left 212px
    z-index -1
    display flex
    justify-content flex-end
    align-items center
    padding-right 5px
    &.retract
      left 38px
  .menu-container
    height 100%
    background #F0F2F5
    .menu-main
      position relative
      .menu-div
        // width 70px
        .menu-info
          width 70px
          height 88px
          display flex
          align-items center
          justify-content center
        .menu-children
          display none
      .menu-div.active
        background #FAFAFA
        .menu-children
          display inline-block
          position absolute
          top 0px
          left 70px
          width 140px
          height 100vh
          padding 24px 18px
          background #FAFAFA
        &.retract .menu-children
          display none
</style>