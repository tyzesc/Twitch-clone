import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import LoadScript from "vue-plugin-load-script";
createApp(App).use(LoadScript).mount('#app')