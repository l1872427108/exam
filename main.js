import Vue from 'vue'
import App from './App'
import store from './store'
import {
    showToast,
    showSuccess,
    showError,
    navTo
} from './utils/app'

Vue.config.productionTip = false
//自定义顶部
import cuCustom from './components/NavCustom/NavCustom.vue'
Vue.component('cu-custom',cuCustom);

App.mpType = 'app'

// 挂载全局函数
Vue.prototype.$toast = showToast
Vue.prototype.$success = showSuccess
Vue.prototype.$error = showError
Vue.prototype.$navTo = navTo

// 实例化应用
const app = new Vue({
	store,
    ...App
})
app.$mount()
