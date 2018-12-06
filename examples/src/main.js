// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
Vue.config.async = false;
Vue.config.debug = true;
import App from './App'
import router from './router'
import store from './store'
import MemoryRouter from '../../src'
// import MemoryRouter from '../../dist/vue-memory-router.esm'

Vue.config.productionTip = false;


// you can use with vuex
Vue.use(MemoryRouter)
// Vue.use(Navigation, {router})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
