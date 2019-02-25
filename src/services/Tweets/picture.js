import axios from '../../utils/axios';

//
export function getImageList(params) {
  return axios.get('/tweet/image', { params });
}

//
export function addImage(params) {
  return axios.post('/tweet/image', params);
}

//
export function getImageById(params) {
  return axios.get(`/tweet/image/${params.id}`);
}

//
export function updateImage(params) {
  return axios.put(`/tweet/image/${params.id}`, params);
}

//
export function deleteImage(params) {
  return axios.delete(`/tweet/image/${params.id}`);
}
