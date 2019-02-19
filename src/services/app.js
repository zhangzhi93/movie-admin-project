import axios from '../utils/axios';

export function getHomePageStatis() {
  return axios.get('/statis/group/home-page');
}

export function getStoreHomePageStatis() {
  return axios.get('/statis/store/home-page');
}

//
export function getProvinces() {
  return axios.get('/system/province');
}

//
export function getCitys(params) {
  return axios.get(`/system/city/${params.id}`);
}

//
export function getCountys(params) {
  return axios.get(`/system/county/${params.id}`);
}

//查询商场绑定的城市列表
export function getStoreCitys() {
  return axios.get(`/system/city/accord-store-bind`);
}

// 查询登录用户权限菜单列表
export function getAuthorizeMenuList() {
  return axios.get(`/authority/authorize`);
}
