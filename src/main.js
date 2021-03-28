import Vue from "vue";
import store from "./store";
import App from "./App.vue";
import { TreeGridPlugin } from "@syncfusion/ej2-vue-treegrid";
require("./assets/index.scss");
import router from "./router";
import VueJwtDecode from "vue-jwt-decode";

Vue.use(TreeGridPlugin);

const jwtDecode = () => {
  if (localStorage.getItem("user-token")) {
    let decodeToken = VueJwtDecode.decode(localStorage.getItem("user-token"));
    store.state.user = decodeToken;
    return decodeToken;
  } else return {};
};

jwtDecode();

new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
