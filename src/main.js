import Vue from 'vue'
import App from './App'
import styles from "./sass/main.scss"

Vue.config.productionTip = false

new Vue({
    el: '#app',
    template: '<App/>',
    components: {App}
})
