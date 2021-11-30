<template>
  <div class="date-picker">
    <div class="btn sub" @click='getCurrent(-1)'></div>
    <div class="content">
        <div 
          v-for="(item, index) in allData" 
          :key="index" 
          class='txt' 
          :class='{active: index == curSwiper,center: index == curSwiper-1}'
          @click='clickDate(item)'>
          {{item.txt}}
        </div>
    </div>
    <div class="btn add" @click='getCurrent(1)'></div>
  </div>
</template>
<script>
  import moment from 'moment'
  export default{
    name: 'DatePicker',
    props: {
      range: {
        type: String,
        default: 'days'
      },
      defVal: {
        type: Object,
        default: moment()
      },
      // current: {
      //   type: Object
      // },
      callback: {
        type: Function
      }
    },
    data(){
      return{
        today: moment(),
        readyNum: 6,
        allDays: [],
        allWeeks: [],
        allMonths: [],
        curSwiper: 2,
        allData: [],
        isToday: true,
        offset: 0
      }
    },
    mounted(){
      this.current = this.defVal
      this.getData()
    },
    methods:{
      clickDate(item){
        let cur = moment(item.cur)
        this.current = cur
        // this.curChange()
        this.getData()
      },
      getData(){
        this.curChange()
        if(this.range == 'weeks'){
          this.allData = this.getWeeks(this.current)
        }else if(this.range == 'months'){
          this.allData = this.getMonths(this.current)
        }else{
          this.allData = this.getDays(this.current)
        }
        this.callback(this.current)
      },
      getCurrent(type){
        if(this.isToday && type > 0){
          return
        } 
        if(type > 0){
          this.current = moment(this.current).add(1, this.range)
        }else{
          this.current = moment(this.current).subtract(1, this.range)
        }
        // this.curChange()
        this.getData()
      },
      curChange(){
        let after = null
        if(this.range == 'weeks'){
          after = moment(this.current).subtract(0, 'weeks').weekday(7)
        }else if(this.range == 'days'){
          after = moment(this.current)
        }else{
          after = moment(this.current).subtract(0, 'months').endOf('month')
        }
        if(
          (this.range != 'months' && 
            (after.format('YYYY/MM/DD') == moment(this.today).format('YYYY/MM/DD') || 
              after.format('YYYY/MM/DD') > moment(this.today).format('YYYY/MM/DD')
            )
          ) || 
          (this.range == 'months' && 
            (after.format('YYYY/MM') == moment(this.today).format('YYYY/MM') || 
              after.format('YYYY/MM') > moment(this.today).format('YYYY/MM')
            )
          )
        ){
          this.isToday = true
          this.offset = 0
          this.curSwiper = 2
          this.current = this.today
        }else{
          this.isToday = false
          this.offset = 1
          this.curSwiper = 1
        }
      },
      getDays(current){
        current = current || this.current
        let curtime = moment(this.today).format('YYYY/MM/DD')
        let yestoday = moment(this.today).subtract(1, 'days').format('YYYY/MM/DD')
        let ago = moment(this.today).subtract(2, 'days').format('YYYY/MM/DD')
        let txts = {
          [curtime]: '今天',
          [yestoday]: '昨天',
          [ago]: '前天'
        }
        this.allDays = []
        for(let i=0; i<3; i++){
          let before = moment(current).subtract(i-this.offset, 'days')
          let dateObj = {
            txt: txts[before.format('YYYY/MM/DD')] || before.format('YYYY/MM/DD'),
            val: [this.getStartUnix(before),this.getEndUnix(before)],
            cur: before
          }
          this.allDays.unshift(dateObj)
        }

        return JSON.parse(JSON.stringify(this.allDays))
      },
      getMonths(current){
        current = current || this.current
        this.allMonths = []
        for(let i=0; i<3; i++){
          let before = moment(current).subtract(i-this.offset, 'months').startOf('month')
          let after = moment(current).subtract(i-this.offset, 'months').endOf('month')
          let dateObj = {
            txt: moment(before).format('MM')+'月',
            val: [this.getStartUnix(before),this.getEndUnix(after)],
            cur: before
          }
          this.allMonths.unshift(dateObj)
        }
        return JSON.parse(JSON.stringify(this.allMonths))
      },
      getWeeks(current){
        current = current || this.current
        this.allWeeks = []
        for(let i=0; i<3; i++){
          let after = moment(current).subtract(i-this.offset, 'weeks').weekday(7)
          let before = moment(current).subtract(i-this.offset, 'weeks').weekday(1)
          let str = before.format('MM/DD') + '-' + after.format('MM/DD')
          let dateObj = {
            txt: str,
            val: [this.getStartUnix(before),this.getEndUnix(after)],
            cur: before
          }
          this.allWeeks.unshift(dateObj)
        }
        return JSON.parse(JSON.stringify(this.allWeeks))
      },
      getStartUnix(val){
        return val.startOf('day').unix()
        // return moment(moment(val).format("YYYY/MM/DD 00:00:00")).unix()
      },
      getEndUnix(val){
        return val.endOf('day').unix()
        // return moment(moment(val).format("YYYY/MM/DD 23:59:59")).unix()
      }
    },
    computed:{
      // current(){
      //   return this.defVal
      // }
    },
    watch:{
      range(){
        this.getData()
      }/*,
      current(newVal,oldVal){
        console.log('current newVal:', newVal)
      }*/
    }
  }
</script>
<style scoped lang='stylus'>
  .date-picker{
    width: 100%;
    height: 100%;
    // min-height: 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // margin: 19px auto;
    user-select: none;
  }
  .btn{
    width: 36px;
    height: 36px;
    background-image: url("https://app-common.ks3-cn-beijing.ksyun.com/jya/slide_btn@3x.png");
    background-size: 100% 100%;
    &.sub{
      transform: rotate(180deg);
    }
  }
  .content{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 274px;
    height: 100%;
    .swiper{
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
    }
    .txt{
      width: auto;
      font-size: 12px;
      font-family: 'HYQiHei-55S';
      display: flex;
      align-items: center;
      color: rgba(0,0,0,.6);
      &.active{
        font-family: 'HYQiHei-60S,HYQiHei-55S';
        font-size: 15px;
        justify-content: flex-end;
        color: rgba(0,0,0,1);
        // width: 81px;
      }
      &.center{
        justify-content: center;
      }
    }
  }
</style>