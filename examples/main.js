import { createApp } from 'vue'
import App from './App.vue'
import selfComponents from '../packages/index'
import jquery from 'jquery'


createApp(App).use(jquery).use(selfComponents).mount('#app')
