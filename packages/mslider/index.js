import mslider from './src/mslider'

mslider.install = function(Vue) {
  Vue.component(mslider.name, mslider)
}

export default mslider