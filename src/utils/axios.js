import axios from 'axios';
import Qs from 'qs';

const instance = axios.create({
  baseURL: '/api/',
  headers: {
    'Content-Type': 'application/json',
  },
  // 超时为5s 上线后是3s
  timeout: 5000,
  paramsSerializer: function(params) {
    for (let key in params) {
      if (!params[key]) {
        delete params[key];
      }
    }
    return Qs.stringify(params, {arrayFormat: 'brackets'});
  },
});

// 请求拦截处理
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 能做的事如下 检查权限 增加页面loading  网络状态判断等
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  // 例如用户请求失效，返回登录页什么的
  return Promise.reject(error);
});

export default instance;
