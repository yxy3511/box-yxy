import sideMenu from './src/sideMenu'

sideMenu.install = function(Vue) {
  Vue.component(sideMenu.name, sideMenu)
}

export default sideMenu