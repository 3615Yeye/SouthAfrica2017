import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'

import BootstrapVue from 'bootstrap-vue'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueResource)

Vue.use(BootstrapVue)

new Vue({
  el: '#main',
  template: '<App/>',
  components: { App }
})
