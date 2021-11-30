<template>
  <div class="hello">
    <div class="plugin">
      <span class='p_label'>滑块:</span>
      <mslider 
        :showGrid='false'
        :getVal='getVal' 
        :stepNum='100' 
        :minVal='0' 
        :maxVal='100' 
        :colors='["#C2C5C5","#808080"]'
        :isOff='!isOn' 
        :defVal='brightness'
        unit='%'
        :styleOptions='{
          onbar_bcolor: "#2C2C2C",
          offbar_bcolor: "#E0E2E2"
        }'
      ></mslider>
    </div>
    <div class="plugin mswitch">
      <span class='p_label'>开关:</span>
      <mswitch
        :getVal='getVal' 
        :isOff='!isOn' 
        :defVal='defVal'
        :valArr="[2,1]"
        :styleOptions='opsObj'
        :ballSize='50'
      ></mswitch>
    </div>
    <div class="plugin datepicker">
      <span class='p_label'>日期滚动选择:</span>
      <date-picker :range='range' :defVal='current' :callback='setCurrent'></date-picker>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      isOn: true,
      brightness: 35,
      defVal: 2,
      opsObj: {
        bar_icons: ["//app-common.ks3-cn-beijing.ksyun.com/jya/lightBtn_far","//app-common.ks3-cn-beijing.ksyun.com/jya/lightBtn_near"],
        onbar_bcolor: "#2C2C2C",
        offbar_bcolor: "#E0E2E2",
        offball_bcolor: "#C2C5C5",
        onball_bcolor: "#808080",
      },
      range: 'days',
      // current: this.$moment()
      current: {}
    }
  },
  methods:{
    setCurrent(cur){
      // console.log('cur:', cur.format('YYYY-MM-DD HH:mm:ss'))
      this.current = cur
    },
    getVal(val){
      console.log('val:', val)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.hello{
  padding: 30px;
  width: 500px;
  margin: 0 auto;
}
.hello:focus{
  outline: none;
}
.plugin{
  width: 200px;
  height: 50px;
  // margin: 0 auto;
  padding: 30px;
  text-align: left;
}
.mswitch{
  width: 100px;
  height: 50px;
  // margin-top: 30px;
  &:focus{
    outline: none;
  }
}
.datepicker{
  width: 500px;
  height: 64px;
  // margin-top: 30px;
}
</style>
