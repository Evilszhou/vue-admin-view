import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import elCascaderMulti from "el-cascader-multi";

import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";
import "./assets/font/iconfont.js";


Vue.config.productionTip = false
Vue.use(VueI18n);
Vue.use(elCascaderMulti);
Vue.use(ElementUI, {
    size: 'small'
});
Vue.prototype.$axios = axios;

const i18n = new VueI18n({
    locale: 'zh',
    messages
})


axios.interceptors.request.use(config => {
    config.headers.token = localStorage.getItem("token");
    console.log("token:"+config.headers.token)
    return config;
},error => {
    console.log('加载超时');
    return Promise.reject(error);
})
let that = this;
window.bus  = new Vue();


// axios.interceptors.response.use(response => {
//   console.log(response.data.code)
//    if(response.data.code == 200 && response.data.msg =="登录成功"){
//         console.log("ok")
//         return response;
//    }
//    if(localStorage.getItem("token") == null){
//         router.replace({
//             path:"login"
//         })
//     }
    
// },error => {
     
//     console.log("加载失败");
//     return Promise.reject(error)

// })

export const postJsonRequest = (url,params) => {
    return axios({
        method:"post",
        url:url,
        data:params,
        dataType:"json",
        headers:{
            'Content-Type': 'application/json',
        }
    })
}


// formData
export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: url,
    data: params,
     dataType:"json",
    transformRequest:[function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}


export const getRequest = (url, data) => {
  return axios({
    method: 'get',
    params: data, 
    url: url,
  });
}

export const downloadFile = (url,data) => {
    return axios({
        method:"get",
        params:data,
        url:url,
        responseType:'blob'
    })
}

Array.prototype.contains = function(obj){
  
    let index = this.length;
    while (index--) {
        if(this[index] === obj){
            return true;
        }
    }
    return false;
}


// router.beforeEach((to,from,next) => {
    
    
// })
router.beforeEach((to, from, next) => {
    let permissions = localStorage.getItem("permissions");
      if(permissions == null){
        next();
        
      }
    let arr = permissions.split(",");
    const token = localStorage.getItem("token");
    // next();
    if(!token){
        console.log(to);
        // next('/login');
        if(to.path == "/login"){
            next("");
        }else{
            next("/login");
        }
       
    }else{
        next();
    }
    next();
    console.log(to.meta.title)
    let flag = arr.contains(to.meta.title);
    console.log(flag)
    if(flag == true){
        next();
    }else{
        next('/403')
    }
}),

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app')