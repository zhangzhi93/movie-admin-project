import axios from '../../utils/axios';

//
export function getMemberOrderList(params) {
  return axios.get('/member/order', { params });
}

//
export function exportMemberOrderList(params) {
  return axios.get('/member/order/export', { params });
}

//
export function getMemberOrderPlatform(params) {
  return axios.get(`/member/order/platform`);
}
