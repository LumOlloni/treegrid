import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import Response from "@/helpers/Response";
import VueJwtDecode from "vue-jwt-decode";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    response: false,
    user: {},
    token: localStorage.getItem("user-token") || "",
    isSuccessAuth: false,
    productData: {
      result: [],
      // loading: false,
      count: 0,
    },
  },
  getters: {
    productData: (state) => state.productData,
    token: (state) => state.token,
    user: (state) => state.user,
    isSuccessAuth: (state) => state.isSuccessAuth,
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
      state.user = VueJwtDecode.decode(token);
      localStorage.setItem("user-token", token);
    },
    SET_IS_SUCCESS_AUTH: (state, { isSuccessAuth }) => {
      state.isSuccessAuth = isSuccessAuth;
    },

    SET_USER: (state, user) => (state.user = user),
    SUCCESS: (state, response) => {
      state.response = response;
    },
    SET_PRODUCT_DATA: (state, productData) => {
      state.productData.result = productData;
      state.productData.count = productData.length;
    },
  },
  actions: {
    async register({ commit }, { data, router }) {
      try {
        const res = await axios.post(
          "http://31.220.57.126:8090/register",
          data
        );

        commit("SET_IS_SUCCESS_AUTH", true);

        setTimeout(() => {
          router.push({ path: "/login" });
        }, 2000);

        return new Response(
          res.data,
          "You Successfully Register please login",
          true
        );
      } catch (err) {
        console.log("err", err);
        router.push({ path: "/register" });

        return err;
      }
    },
    async login({ commit }, { data, router }) {
      try {
        const res = await axios.post("http://31.220.57.126:8090/login", data);
        commit("SET_TOKEN", res.data);
        router.push({ path: "/treegrid" });
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
});

export default store;
