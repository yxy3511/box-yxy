import datePicker from './src/datePicker'

datePicker.install = function(Vue) {
  Vue.component(datePicker.name, datePicker)
}

export default datePicker