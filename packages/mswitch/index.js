import mswitch from './src/mswitch'

mswitch.install = function(Vue) {
  Vue.component(mswitch.name, mswitch)
}

export default mswitch