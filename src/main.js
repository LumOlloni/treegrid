import Vue from "vue";
import store from "./store";
import App from "./App.vue";
import { TreeGridPlugin } from "@syncfusion/ej2-vue-treegrid";
require("./assets/index.scss");
import router from "./router";

Vue.use(TreeGridPlugin);

new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
