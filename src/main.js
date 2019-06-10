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
//     console.log(response.data.msg)
//     console.log(response.data.msg  == "登陆成功")
//     if(response.data.msg == "登录成功"){
//         console.log("hahah");
//         console.log(localStorage.getItem("token")); 
//     }else if(response.data.code === 401){
//         window.bus.$router.replace("/login")
//     }else{
//         return response;
       
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
    // console.log(localStorage.getItem("permissions"))
  
    // console.log(arr);
    // console.log(to.meta.title);
    // console.log(arr[3])
    // console.log(to.meta.title == arr[6])
    // console.log(arr.contains(to.meta.title));
      let permissions = localStorage.getItem("permissions");
      if(permissions == null){
        next();
        return;
      }
    let arr = permissions.split(",");
    const token = localStorage.getItem("token");
    if(!token){
        next('/login');
    }
    let flag = arr.contains(to.meta.title);
    console.log(flag)
    if(flag == true){
        next();
    }else{
        next('/403')
    }
  
    // console.log(to.meta);
    // next();
    // const role = localStorage.getItem('ms_username');
    // if (!role && to.path !== '/login') {
    //     next('/login');
    // } else if (to.meta.permission) {
    //     // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    //     role === 'admin' ? next() : next('/403');
    // } else {
    //     // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    //     if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
    //         Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
    //             confirmButtonText: '确定'
    //         });
    //     } else {
    //         next();
    //     }
    // }
})

//使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//     // console.log(localStorage.getItem("permissions"))
  
//     // console.log(arr);
//     // console.log(to.meta.title);
//     // console.log(arr[3])
//     // console.log(to.meta.title == arr[6])
//     // console.log(arr.contains(to.meta.title));
//       let permissions = localStorage.getItem("permissions");
//       if(permissions == null){
//         next();
//         return;
//       }
//     let arr = permissions.split(",");
//     const token = localStorage.getItem("token");
//     if(!token && to.path !== '/login'){
//         next('/login');
//     }
//     // next();
//     console.log(to.meta.title)
//     let flag = arr.contains(to.meta.title);
//     console.log(flag)
//     if(flag == true){
//         next();
//     }else{
//         next('/403')
//     }
  
//     // console.log(to.meta);
//     // next();
//     // const role = localStorage.getItem('ms_username');
//     // if (!role && to.path !== '/login') {
//     //     next('/login');
//     // } else if (to.meta.permission) {
//     //     // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
//     //     role === 'admin' ? next() : next('/403');
//     // } else {
//     //     // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
//     //     if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
//     //         Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
//     //             confirmButtonText: '确定'
//     //         });
//     //     } else {
//     //         next();
//     //     }
//     // }
// })


new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app')