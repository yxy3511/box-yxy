<template>
  <div class="side-menu-component">
    <div class="menu-container">
      <div class="menu-main">
        <div class="menu-border">
          <div class="menu-div" v-for='menu in menus' :key='menu.id' :class="{active: curMenu.id == menu.id}">
            <div class="menu-info" @click='setCurId(menu)'>
              <i class="icon iconfont" :class='[menu.icon ? menu.icon : ""]'></i>
              {{menu.name}}
            </div>
            <div class="menu-children">
              <div class="menu-menu-info" v-for='(item, index) in menu.children' :key='menu.id+"_"+index'>{{item.name}}</div>
              <div class="stretch" @click='changeRetract()'>
                <i class="icon iconfont icon-page_turning_right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
export default {
  name: 'SideMenu',
  data() {
    return {
      retract: false,
      timer: null,
      during: 500,
      curMenu: {},
      // hideReractBtn: false,
      datas: [{
        id: 1,
        name: '设备',
        icon: 'icon-view',
        children: [{
          name: '设备管理',
          path: '',
          params: '',
          isHide: false
        }, {
          name: '上线配置',
          path: '',
          params: '',
          isHide: false
        }]
      }, {
        id: 2,
        name: '产品',
        icon: 'icon-message',
        children: [{
          name: '产品管理',
          path: '',
          params: '',
          isHide: false
        }, {
          name: '产品配置',
          path: '',
          params: '',
          isHide: false
        }]
      }, {
        id: 3,
        name: '产品2',
        icon: 'icon-message',
        path: '/pro2',
        children: []
      }, {
        id: 3,
        name: '产品3',
        icon: '',
        path: '',
        children: []
      }]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.curMenu = this.menus[0]
    })
  },
  methods: {
    setCurId(menu) {
      this.curMenu = menu
      if (this.curMenu.children && !!this.curMenu.children.length) {
        this.hideReractBtn = false
        this.retract = false
      } else {
        this.retract = true
        this.hideReractBtn = true
      }
    },
    changeRetract() {
      this.retract = !this.retract
    },
    menuAnimate(elem, targets, callback = () => {}, during = this.during) {
      const ops = {}
      targets.forEach(item => {
        ops[item.key] = item.val
      })
      elem.animate(ops, during, 'swing', callback)
    },
    hideReractBtnFunc() {
      const stretch = $('.stretch')
      stretch.css('display', this.hideReractBtn ? 'none' : 'flex')
    },
    setStretch(val, deg) {
      const elem = $('.menu-div .menu-children')
      const icon = $('.menu-div .menu-children .stretch .iconfont')
      this.menuAnimate(elem, [{ key: 'left', val: val + 'px' }], () => {
        this.hideReractBtnFunc()
        icon.css('transform', 'rotate(' + deg + 'deg)')
      })
    }
  },
  computed: {
    menus() {
      const res = this.datas.filter(item => {
        return item.path || (item.children && !!item.children.length)
      })
      return res
    }
  },
  watch: {
    retract() {
      if (this.retract) {
        this.setStretch(-70, 0)
      } else {
        this.hideReractBtnFunc()
        this.setStretch(70, 180)
      }
    }
  }
}
</script>
<style scoped lang='stylus'>
$active_color = rgba(23, 103, 232, 1)
.side-menu-component
  position absolute
  // left 0
  // top 0
  height 100%
  z-index 99
  .stretch
    width 54px
    height 54px
    border .5px solid #E8E8E8
    border-radius 50%
    background #FAFAFA
    color #000
    clip-path polygon(50% 0%, 100% 0%, 100% 42000%, 50% 50%)
    // position absolute
    // top 50%
    // left 182px
    // z-index 2
    display flex
    justify-content flex-end
    align-items center
    padding-right 5px
    position absolute
    top 45%
    left 112px
    &:hover
      cursor pointer
    .iconfont
      font-size 19px
      color $active_color
      transform rotate(180deg)
  .menu-container
    height 100%
    background #F0F2F5
    .menu-main
      position relative
      // width 210px
      height 100%
      // overflow hidden
      .menu-border
        width 70px
        height 100%
        border-right .5px solid #E8E8E8
      .menu-div
        // width 70px
        .menu-info
          font-family PingFangSC-Semibold, PingFang SC
          width 70px
          height 88px
          display flex
          flex-direction column
          align-items center
          justify-content center
          font-size 14px
          color rgba(0, 0, 0, 0.65)
          // z-index 2
          &:hover
            cursor pointer
          .iconfont
            font-size 26px
        .menu-children
          display none
          font-size 13px
          color #000
          line-height 22px
          z-index -1
          position absolute
          top 0px
          left 70px
          width 140px
          height 100%
          padding 24px 18px
          background #FAFAFA
          box-sizing border-box
          border-right .5px solid #E8E8E8
          .menu-menu-info
            margin-bottom 20px
            &:hover
              cursor pointer
      .menu-div.active
        background #FAFAFA
        border-right 1px solid #FAFAFA
        width 71px
        .menu-info
          color rgba(23, 103, 232, 1)
        .menu-children
          display inline-block
          .menu-menu-info:first-child
            color rgba(23, 103, 232, 1)
</style>
