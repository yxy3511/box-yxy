import { createApp } from 'vue'
import App from './App.vue'
import selfComponents from '../packages/index'


createApp(App).use(selfComponents).mount('#app')
