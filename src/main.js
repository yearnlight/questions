import Vue from 'vue';
import App from './App.vue';
import Axios from "axios";
import ElementUI from "element-ui";
import VueRouter from "vue-router";
import router from "@/common/router.js";
import "element-ui/lib/theme-chalk/index.css";
import api from "@/common/api";
import filters from "@/common/filter";
import Http from "@/common/http";
import Print from 'vue-print-nb'

Vue.prototype.$api = api;
Vue.prototype.$axios = Axios;
// 封装http服务
Vue.prototype.$http = Http;

Axios.interceptors.request.use(config => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers["X-Auth-Token"] = token;
  }
  return config;
});
//返回状态判断(添加响应拦截器)
Axios.interceptors.response.use((res) => {
  //对响应数据做些事
  if (res.data) {
    return Promise.resolve(res.data);
  }
  return res;
}, (error) => {
  if (error.response.status == 401) {
    sessionStorage.clear();
    window.webapp.$router.push("/index");
    window.webapp.$router.go(0);
  }
  return Promise.reject(error);
});

Vue.config.productionTip = false;
Vue.use(ElementUI, {
  size: "small"
});
Vue.use(VueRouter);
Vue.use(Print);
//加载全局过滤器
Object.keys(filters).forEach(k => { Vue.filter(k, filters[k]) });

window.webapp = new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
