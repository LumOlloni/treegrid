import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    productData:[],
  },
  getters:{
    productData:state => state.productData
  },
  mutations: {
    SET_PRODUCT_DATA:(state , productData ) => state.productData = productData
  },
  actions:{
    async getProductData({commit}) {
      try { 
         const res = await axios.get("http://localhost:8090/products/all"); 
         commit("SET_PRODUCT_DATA" , res.data);
      } catch (error) {
        console.error(error)
      }
    }
  }
})

export default store;