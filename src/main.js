// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import MyBread from '@/components/myBread.vue'

import moment from 'moment'
import HttpTool from '@/plugins/http.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/index.css'
import router from './router'

Vue.config.productionTip = false

Vue.use(HttpTool)
Vue.use(ElementUI)

Vue.filter('formDate',function(v){
  return moment(v).format('YYYY-MM-DD')
})

Vue.component(MyBread.name, MyBread)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
