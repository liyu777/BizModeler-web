// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import router from './router'
import store from './store'
import axios from 'axios'
import './assets/main.css'
import EnvConfig from '../static/config/env-config.json'

Vue.config.productionTip = false

Vue.use(ElementUI)
axios.defaults.baseURL = EnvConfig.apiHost
axios.defaults.timeout = 1000 * 15
window.axios = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  render: h => h(App),
  components: { App }
})

