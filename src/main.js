import Vue from 'vue'
import VueTouch from "vue-touch"
import App from './App'
import styles from "./sass/main.scss"

Vue.use(VueTouch, {name: 'v-touch'})
Vue.config.productionTip = false

import Bubbles from "./Bubbles.vue"
Vue.component('bubbles', Bubbles)

new Vue({
    el: '#app',
    template: '<App/>',
    components: {App}
})
