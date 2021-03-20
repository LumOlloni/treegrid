import Vue from 'vue'
import store from './store';
import App from './App.vue'
import { TreeGridPlugin } from "@syncfusion/ej2-vue-treegrid";
require("./assets/index.scss")

Vue.use(TreeGridPlugin);

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
