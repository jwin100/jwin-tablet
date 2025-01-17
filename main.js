import Vue from 'vue'
import App from './App'

// vuex
import store from './store'

// 引入全局uView
import uView from '@/uni_modules/uview-ui'
import iModal from './components/i-modal/i-modal.vue'
import iToast from './components/i-toast/i-toast.vue'

import mixin from './common/mixin'
Vue.prototype.$store = store

Vue.config.productionTip = false

App.mpType = 'app'
Vue.use(uView)
Vue.component('iModal', iModal)
Vue.component('iToast', iToast)

// #ifdef MP
// 引入uView对小程序分享的mixin封装
const mpShare = require('@/uni_modules/uview-ui/libs/mixin/mpShare.js')
Vue.mixin(mpShare)
// #endif

Vue.mixin(mixin)

const app = new Vue({
	store,
	...App
})

// 引入请求封装
require('@/common/request/index')(app)

app.$mount()