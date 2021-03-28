import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    response: false,
    user: {},
    isSuccessAuth: false,
    productData: {
      result: [],
      // loading: false,
      count: 0,
    },
  },
  getters: {
    productData: (state) => state.productData,
    user: (state) => state.user,
    isSuccessAuth: (state) => state.isSuccessAuth,
  },
  mutations: {
    SET_IS_SUCCESS_AUTH: (state, { isSuccessAuth }) => {
      state.isSuccessAuth = isSuccessAuth;
    },
    SET_USER: (state, user) => (state.user = user),
    SUCCESS: (state, response) => {
      state.response = response;
    },
    SET_PRODUCT_DATA: (state, productData) => {
      state.productData.result = productData;
      // .map((product) => {
      //   if (product.parentID === null) {
      //     delete product.parentID;
      //   }
      //   return { ...product };
      // });
      state.productData.count = productData.length;
    },
  },
  actions: {
    async register({ commit }, { data, router }) {
      try {
        const res = await axios.post("http://localhost:8090/register", data);

        commit("SET_IS_SUCCESS_AUTH", true);
        // res.data.message = "You Successfully Register please login";
        // res.data.registerSuccess = true;

        setTimeout(() => {
          router.push({ path: "/login" });
        }, 2000);

        return {
          ...res.data,
          message: "You Successfully Register please login",
          registerSuccess: true,
        };
      } catch (err) {
        console.log("err", err);
        router.push({ path: "/register" });

        return err;
      }
    },
    login({ commit }, data) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(data);
          commit("SET_USER", data);
          commit("SET_IS_SUCCESS_AUTH", true);
        }, 3000);
      });
    },
    async getProductData({ commit }) {
      // try {
      //   const res = await axios.get("http://localhost:8090/products/all");
      //   commit("SET_PRODUCT_DATA", res.data);
      //   commit("SUCCESS");
      // } catch (error) {
      //   console.error(error);
      // }
      return new Promise((resolve) => {
        axios.get("http://localhost:8090/products/all").then((res) => {
          resolve(res.data);

          commit("SUCCESS");
        });
      });
    },
    async deleteProduct({ commit }, { TaskID, state }) {
      try {
        await axios.post(
          "http://localhost:8090/products/delete",
          {},
          {
            params: {
              TaskID: TaskID,
            },
          }
        );
        commit("SUCCESS");
        state.endEdit();
      } catch (error) {
        console.error(error);
      }
    },

    async saveProducts({ commit }, { dataToSend, state }) {
      try {
        await axios.post("http://localhost:8090/products/save", dataToSend);
        // resolve(res.data);
        commit("SUCCESS");
        state.endEdit();
      } catch (error) {
        console.error(error);
      }
      // return new Promise((resolve) => {
      //   axios
      //     .post("http://localhost:8090/products/save", dataToSend)
      //     .then((res) => {
      //       console.log("res", res.data);

      //       commit("SUCCESS");
      //     })
      //     .catch((err) => console.log("err", err));
      // });
    },
  },
});

export default store;
