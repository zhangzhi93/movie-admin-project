import axios from '../../utils/axios';

//
export function getMemberTagList(params) {
  return axios.get('/member/tag', { params });
}

//
export function addMemberTag(params) {
  return axios.post('/member/tag', params);
}

//
export function getMemberTagById(params) {
  return axios.get(`/member/tag/${params.id}`);
}

//
export function updateMemberTag(params) {
  return axios.put(`/member/tag/${params.id}`, params);
}

//
export function deleteMemberTag(params) {
  return axios.delete(`/member/tag/${params.id}`);
}

//
export async function getMemberTagOption(params) {
  return axios.get('/member/tag/option', { params });
}
