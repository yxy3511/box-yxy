<template>
  <div 
    class="slider-container" 
    :class='{"on": !isOff}' 
    @click='clickMove' 
  >
    <div 
      class="line-bar" 
      @touchstart="touchStart"  
      @touchend="touchEnd" 
      :style='{backgroundColor: barGbColor}'
    >
      <div class="lights">
        <div 
          class="light" 
          :class='{"on": !isOff}' 
          v-for='(item,index) in valArr'
          :key='index'
          :style='{width: ballSize*2+"rpx",height: ballSize*2+"rpx"}'
        >
          <div 
            class="icon middle" 
            :style='{backgroundImage:
              curVal == item && (styleOps.select_offbar_icons && styleOps.select_offbar_icons.length) && (styleOps.select_onbar_icons && styleOps.select_onbar_icons.length) ? 
              (isOff ? 
              "url("+styleOps.select_offbar_icons[index]+unitStr+")" : 
              "url("+styleOps.select_onbar_icons[index]+unitStr+")"
              ) : 
              ($url && $url.length ? 
                "url("+$url[index]+unitStr+")" : 
                null
              )}'
          ></div>
        </div>
      </div>
      <div 
        class="ball"
        :style='{backgroundColor: ballGbColor,width: ballSize*2+"rpx",height: ballSize*2+"rpx",left:(curVal == maxVal ? (isSwitch || -1)+"px" : (curVal == minVal ? "auto" : ballSize*2+"rpx")),right:curVal == minVal ? (isSwitch || -1)+"px" : "auto",top: (isSwitch || -1)+"px"}' 
        :class='{
          "on":!isOff
        }'
      ></div>
    </div>
  </div>
</template>
<script>
  export default{
    name: 'mswitch',
    props:{
      getVal: Function,
      valArr: {
        type: Array,
        default: ()=>{
          return [1,0] // 排序从大到小
        }
      },
      ballSize: {
        type: Number,
        default: 14
      },
      defVal: {
        type: Number,
        default: 0
      },
      isSwitch: {
        type: Number,
        default: 0  // 开关top值
      },
      isOff: {
        type: Boolean,
        default: true
      },
      styleOptions: {
        type: Object,
        default: function() {
          return {
            bar_icons: [],
            select_offbar_icons: [],
            select_onbar_icons: [],
            offbar_bcolor: null,
            offbar_icons: [],
            offball_bcolor: null,
            onbar_bcolor: null,
            onbar_icons: [],
            onball_bcolor: null
          }
        }
      }
    },
    data(){
      return {
        startPos: null,
        sliderBarWidth: null,
        // ballSize: null,
        curVal: null,
        isMoving: false,
        minVal: null,
        maxVal: null
      }
    },
    mounted(){
      this.$nextTick(()=>{
        this.getInfo()
        this.curVal = this.defVal
        this.maxVal = this.valArr[0]
        this.minVal = this.valArr[this.valArr.length-1]
      })
    },
    methods:{
      touchStart(e){
        if(this.isOff && !this.isSwitch) return
        this.startPos = e.pageX
        this.isMoving = true
      },
      touchEnd(e){
        if(this.isOff && !this.isSwitch) return
        this.setActiveLen(e)
        this.getVal(this.curVal)
        this.isMoving = false
      },
      clickMove(e){
        if(this.isOff && !this.isSwitch) return
        if(this.isSwitch){
          this.curVal = this.curVal == this.valArr[0] ? this.valArr[1] : this.valArr[0]
          this.getVal(this.curVal)
        }else{
          // let startClick = e.mp.currentTarget.offsetLeft
          // let endClick = e.mp.detail.x
          let startClick = document.getElementsByClassName('slider-container')[0].getBoundingClientRect().left
          let endClick = e.x
          let addLen = endClick - startClick
          // let index = Math.min(this.valArr.length-1,Math.max(0,Math.floor(addLen / this.ballSize)))
          let index = Math.floor(addLen / this.ballSize)
          this.curVal = this.valArr[index]
          this.getVal(this.curVal)
        }
      },
      setActiveLen(e){
        let endPos = e.pageX
        let addLen = endPos - this.startPos
        let absLen = Math.abs(addLen)
        if(absLen < 1 || (addLen < 0 && this.curVal == this.maxVal) || (addLen > 0 && this.curVal == this.minVal)){ // || absLen < this.ballSize/2
          return 
        }
        let offset = Math.ceil(absLen / this.ballSize)
        this.curVal = addLen < 0 ? Math.min(this.maxVal, this.curVal + offset) :  Math.max(this.minVal, this.curVal - offset)
      },
      getInfo(){
        let sliderBar = document.getElementsByClassName('slider-container')[0].getBoundingClientRect()
        this.sliderBarWidth = sliderBar ? sliderBar.width : 0
      }
    },
    computed:{
      styleOps(){
        return this.styleOptions
      },
      barGbColor(){
        return (this.isOff ? this.styleOps.offbar_bcolor : this.styleOps.onbar_bcolor) || '#fff'
      },
      ballGbColor(){
        return (this.isOff ? this.styleOps.offball_bcolor : this.styleOps.onball_bcolor) || '#E2E2E2'
      },
      unitStr(){
        let ratio = window.devicePixelRatio > 2 ? 3 : 2
        let unitStr = '@'+ratio+'x.png'
        return unitStr
      },
      $url(){
        return (this.isOff ? this.styleOps.offbar_icons : this.styleOps.onbar_icons) || this.styleOps.bar_icons || null
      }
    },
    watch:{
      defVal(){
        if(this.isMoving) return 
        this.curVal = this.defVal
      }
    }
  }
</script>
<style scoped lang='stylus'>
  // @import '~@/stylus/mixin.styl'
  .slider-container{
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    width: 100%;
    height: 100%;
    &:focus{
      outline: none;
    }
    .line-bar{
      width: 100%;
      height: 100%;
      // background-color: #fff;
      border-radius: 50px;
      position: relative;
      border: 1px solid  transparent;
      box-sizing: border-box;
      &:focus{
        outline: none;
      }
      .ball{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        // background-color: #fff;
        position: absolute;
        top: 0;
        right: 0;
        &:focus{
          outline: none;
        }
        // &.middle{
        //   left: 46px;
        // }
        // &.max{
        //   left: 0;
        // }
        // &.min{
        //   right: 0;
        //   left: auto;
        // }
        &.on{
          background-color: #535353;
          &:focus{
            outline: none;
          }
        }
        
      }
      .lights{
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        .light{
          // width: 46px;
          // height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          .icon{
            width: 20px;
            height: 20px;
            background-size: 100% 100%;
            z-index: 1;
          }
        }
      }
    }
  }
</style>