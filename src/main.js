import Vue from 'vue'
import App from './App'
import styles from "./sass/main.scss"

Vue.config.productionTip = false

import VueAnalytics from "vue-analytics"

Vue.use(VueAnalytics, {
    id: 'UA-100999435-4',
})

new Vue({
    el: '#app',
    template: '<App/>',
    components: {App}
})
