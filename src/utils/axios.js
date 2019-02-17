import axios from 'axios';
import qs from 'qs';
import config from '../utils/config';

const instance = axios.create({
  // -------------------------------------------
  baseURL: process.env.NODE_ENV == 'development' ? '/service1210/' : config.url,
  headers: {
    'Content-Type': 'application/json',
    'CsrfToken': config.CsrfToken,
  },
  // -------------------------------------------

  // transformRequest: [data => qs.stringify(data)],
  // 超时为5s 上线后是3s
  //timeout: 5000,
  timeout: 60000,
  withCredentials: true,
  paramsSerializer: function (params) {
    for (let key in params) {
      if (params[key] === '' || params[key] === undefined || params[key] === null) {
        delete params[key];
      }
    }
    return qs.stringify(params);
  },
});


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
  if (response.data.status === 4018 || response.data.status === 4012) {
    window.location.replace('#/Login');
  }
  return response;
}, function (error) {
  // 对响应错误做点什么
  // 例如用户请求失效，返回登录页什么的
  return Promise.reject(error);
});

export default instance;
