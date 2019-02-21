import axios from '../../utils/axios';

// 查询用户信息列表
export function getUserList(params) {
  return axios.get('/member/member', { params });
}

// 获取用户详情
export function getUserById(params) {
  return axios.get(`/member/member/${params.id}`);
}

// 编辑
export function updateUser(params) {
  return axios.put(`/member/member/${params.id}`, params);
}

// 加入分组
export function updateUserBatch(params) {
  return axios.post(`/member/member-member-group/batch`, params);
}

// 批量加入分组
export function updateUserBatchAll(params) {
  return axios.post(`/member/member-member-group/auto`, params);
}

// 冻结
export function freeze(params) {
  return axios.put(`/member/member/batch-freeze`, params);
}

//根据id冻结
export function freezeById(params) {
  return axios.put(`/member/member/freeze/${params.id}`, params);
}

// 导出账号列表
export function exportUserList(params) {
  return axios.get('/member/member/export', { params });
}

// 恢复
export async function recoverById(params) {
  return axios.put(`/member/member/recover/${params.id}`);
}
