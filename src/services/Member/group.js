import axios from '../../utils/axios';

//
export function getMemberGroupList(params) {
  return axios.get('/member/member-group', { params });
}

//
export function addMemberGroup(params) {
  return axios.post('/member/member-group', params);
}

//
export function getMemberGroupById(params) {
  return axios.get(`/member/member-group/${params.id}`);
}

//
export function updateMemberGroup(params) {
  return axios.put(`/member/member-group/${params.id}`, params);
}

//
export function deleteMemberGroup(params) {
  return axios.delete(`/member/member-group/${params.id}`);
}

//
export async function exportMemberGroupList(params) {
  return axios.get('/member/member-group/export', { params });
}

export async function getMemberGroupOption(params) {
  return axios.get('/member/member-group/option', { params });
}

