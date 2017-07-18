import Vue from 'vue'
import App from './App'
import styles from "./sass/main.scss"

Vue.config.productionTip = false

import Bubbles from "./Bubbles.vue"
Vue.component('bubbles', Bubbles)

new Vue({
    el: '#app',
    template: '<App/>',
    components: {App}
})
