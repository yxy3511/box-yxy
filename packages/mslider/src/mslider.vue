<template>
  <div class="linght-slider-container">
    <div 
      class="line-bar" 
      @click='clickMove' 
      :class='{on: !isOff}'
      :style='{backgroundColor: barGbColor}'
    >
      <div class="txt">
        <div class="start">
          <span v-if='$url' class="micon" :style='{backgroundImage:"url("+($url ? $url[0]+unitStr : "")+")"}'></span>
          <span v-else>{{minTxt || (minVal+unit) || ''}}</span>
        </div>
        <div class="grid" v-if='showGrid'>
          <div class="line" v-for='n in (stepNum-1)' :key='n'></div>
        </div>
        <div class="end">
          <span v-if='$url' class="micon" :style='{backgroundImage:"url("+($url ? $url[1]+unitStr : "")+")"}'></span>
          <span v-else>{{maxTxt || (maxVal+unit) || ''}}</span>
        </div>
      </div>
      <div class="active-bar" :style='{width: (curVal == maxVal ? sliderBarWidth : activeLen)+"px",background: !isOff ? "linear-gradient(to right, "+colors[1]+", "+colors[colors.length-1]+")" : colors[0]}'>
        <div class="ball" @touchstart="touchStart"  @touchend="touchEnd" @touchmove='touchmove' ></div>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    name: 'mslider',
    props:{
      getVal: Function,
      maxVal: Number,
      minVal: Number,
      stepNum: {
        type: Number,
        default: 12
      },
      unit: String,
      colors: Array,
      maxTxt: String,
      minTxt: String,
      defVal: {
        type: Number,
        default: 0
      },
      isOff: {
        type: Boolean,
        default: true
      },
      showGrid: {
        type: Boolean,
        default: true
      },
      styleOptions: {
        type: Object,
        default: function() {
          return {
            bar_icons: [],
            offbar_bcolor: null,
            offbar_icons: [],
            onbar_bcolor: null,
            onbar_icons: [],
          }
        }
      }
    },
    data(){
      return {
        originPos: null,
        startPos: null,
        activeLen: 0,
        sliderBarWidth: null,
        ballWidth: null,
        steplen: null,
        curVal: null,
        notMove: true
      }
    },
    mounted(){
      this.$nextTick(()=>{
        this.getInfo()
      })
    },
    methods:{
      touchStart(e){
        if(this.isOff) return
        this.startPos = e.pageX
        this.originPos = e.pageX
        this.notMove = true
      },
      touchmove(e){
        if(this.isOff) return
        this.notMove = false
        this.setActiveLen(e)
        this.startPos = e.pageX // 每次滑动都以上一次结果开始算
      },
      touchEnd(e){
        if(this.isOff) return
        let addLen = e.pageX - this.originPos
        let addVal = Math.round(addLen/this.steplen) //增加了多少度
        if(!addVal) return 
        // 计算实时温度
        let newVal = addVal + (this.curVal || this.defVal)
        if(newVal > this.maxVal || newVal == this.maxVal || this.activeLen > this.sliderBarWidth || this.activeLen == this.sliderBarWidth){
          // 增加到底
          this.activeLen = this.sliderBarWidth
          this.curVal = this.maxVal
        }else if(newVal < this.minVal || newVal == this.minVal || this.activeLen < this.ballWidth || this.activeLen == this.ballWidth){
          // 减少到底
          this.activeLen = this.ballWidth
          this.curVal = this.minVal
        }else{
          this.curVal = newVal
          this.notMove ? this.setActiveLen(e) : null
        }
        this.notMove = true
        this.getVal(this.curVal)
      },
      clickMove(e){
        if(this.isOff) return
        let left = e.x
        let curActiveLen = left - this.leftLen + this.ballWidth/2
        let curVal = Math.round((curActiveLen - this.activeLen)/this.steplen) + (this.curVal || this.defVal)
        if(curVal > this.maxVal){
          this.curVal = this.maxVal
        }else if(curVal < this.minVal){
          this.curVal = this.minVal
        }else{
          this.curVal = curVal
        }
        this.activeLen = curActiveLen
        this.getVal(this.curVal)
      },
      setActiveLen(e){
        let endPos = e.pageX
        let addLen = endPos - this.startPos
        let newWidth = this.activeLen + addLen
        if(newWidth > this.sliderBarWidth || newWidth == this.sliderBarWidth){
          newWidth = this.sliderBarWidth
          this.curVal = this.maxVal
        }else if(newWidth < this.ballWidth || newWidth == this.ballWidth){
          newWidth = this.ballWidth
          this.curVal = this.minVal
        }
        this.activeLen = newWidth
      },
      getInfo(){
        /*const query = wx.createSelectorQuery()
        let sliderBar = query.select('.linght-slider-container')
        sliderBar.boundingClientRect()

        let ballQuery = query.select('.ball')
        ballQuery.boundingClientRect()

        query.exec((res)=>{
          this.leftLen = res[0].left
          this.sliderBarWidth = res[0].width
          this.ballWidth = res[1].width
          // this.activeLen = this.ballWidth
          this.steplen = (this.sliderBarWidth - this.ballWidth) / this.stepNum // 从球的中线开始算
          this.activeLen = this.defVal == this.maxVal ? this.sliderBarWidth : (this.defVal-this.minVal) * this.steplen + this.ballWidth
        })*/

        let sliderBar = document.getElementsByClassName('linght-slider-container')[0].getBoundingClientRect()
        let ballQuery = document.getElementsByClassName('ball')[0].getBoundingClientRect()
        this.leftLen = sliderBar.left
        this.sliderBarWidth = sliderBar.width
        this.ballWidth = ballQuery.width
        // this.activeLen = this.ballWidth
        this.steplen = (this.sliderBarWidth - this.ballWidth) / this.stepNum // 从球的中线开始算
        this.activeLen = this.defVal == this.maxVal ? this.sliderBarWidth : (this.defVal-this.minVal) * this.steplen + this.ballWidth
      }
    },
    computed:{
      styleOps(){
        // return JSON.parse(this.styleOptions)
        return this.styleOptions
      },
      barGbColor(){
        return (this.isOff ? this.styleOps.offbar_bcolor : this.styleOps.onbar_bcolor) || '#E1E2E2'
      },
      unitStr(){
        // let ratio = parseInt(wx.getSystemInfoSync().pixelRatio) > 2 ? 3 : 2
        let ratio = window.devicePixelRatio > 2 ? 3 : 2
        let unitStr = '@'+ratio+'x.png'
        return unitStr
      },
      $url(){
        return (this.isOff ? this.styleOps.offbar_icons : this.styleOps.onbar_icons) || this.styleOps.bar_icons
      }
    },
    watch:{
      defVal(){
        // if(!this.notMove) return 
        this.activeLen = (this.defVal-this.minVal) * this.steplen + this.ballWidth
      }
    }
  }
</script>
<style scoped lang='stylus'>
  .linght-slider-container{
    width: 100%;
    height: 100%;
    .line-bar{
      width: 100%;
      height: 100%;
      background-color: #E1E2E2;
      border-radius: 50px;
      display: flex;
      align-items: center;
      position: relative;
      .active-bar{
        display: flex;
        align-items: center;
        // width: 100%;
        height: 100%;
        border-radius: 50px;
        // background: linear-gradient(to right, #FEB76E, #F2714B);
        position: relative;
        min-width: 48px;
        height: 100%;
        .ball{
          height: 38px;
          width: 38px;
          border-radius: 50%;
          background-color: #fff;
          position: absolute;
          right: 0px;
          z-index: 1;
          // border: 5px solid #C2C5C5;
          border: 5px solid transparent;
          background-clip: padding-box;
          // position: absolute;
          // margin-left: 5px;
          // margin-right: 5px;
        }
      }
      .txt{
        position: absolute;
        left: 0;
        right: 0;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 15px;
        padding-right: 15px;
        font-size: 12px;
        .micon{
          display: inline-block;
          width: 22.74px;
          height: 22.74px;
          background-size: 100% 100%;
        }
        .start{
          // color: rgba(255,255,255,.6);
          z-index: 1;
        }
        .grid{
          z-index: 1;
          width: 182px;
          display: flex;
          justify-content: space-between;
          .line{
            width: 2px;
            height: 8px;
            background-color: rgba(0,0,0,1)
            opacity:0.05;
          }
        }
        .end{
          // color: rgba(0,0,0,.2)
        }
        .start, .end{
          display flex
          user-select none
          color #fff
        }
      }
      &.on{
        background-color: rgba(240,240,240,.1);
        .ball{
          border: 5px solid transparent;
        }
      }
    }
  }
</style>