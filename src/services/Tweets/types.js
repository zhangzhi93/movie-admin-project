import axios from '../../utils/axios';

//
export function getClassifyList(params) {
  return axios.get('/tweet/classify', { params });
}

//
export function addClassify(params) {
  return axios.post('/tweet/classify', params);
}

//
export function getClassifyById(params) {
  return axios.get(`/tweet/classify/${params.id}`);
}

//
export function updateClassify(params) {
  return axios.put(`/tweet/classify/${params.id}`, params);
}

//
export function deleteClassify(params) {
  return axios.delete(`/tweet/classify/${params.id}`);
}

//
export function getClassifyOption(params) {
  return axios.get('/tweet/classify/option', { params });
}
