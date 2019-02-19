import axios from '../utils/axios';

// 分页查询影院列表
export function getStoreList(params) {
  return axios.get('/store/store', { params });
}

// 新增影院信息
export function addStore(params) {
  return axios.post('/store/store', params);
}

// 根据id查询影院信息
export function getStoreById(params) {
  return axios.get(`/store/store/${params.id}`);
}

// 根据id查询影院信息
export function getStoreCodeById(params) {
  return axios.get(`/store/store/${params.id}/qrcode`);
}

// 根据id查询影院信息
export function getStoreManageById(params) {
  return axios.get(`/store/manage/${params.id}`);
}

// 更新影院信息
export function updateStore(params) {
  return axios.put(`/store/store/${params.id}`, params);
}

// 查询当前用户影院信息
export function getStoreByUser(params) {
  return axios.get('/store/store/current', { params });
}

// 导入影院信息
export function importStore(params) {
  return axios.post('/store/store/import', params);
}

// 查询影院列表选项
export function getStoreOption(params) {
  return axios.get('/store/store/option', { params });
}

// 下载模板
export function downloadTemplet(params) {
  return axios.get('/store/store/download', { params });
}
