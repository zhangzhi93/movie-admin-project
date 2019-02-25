import axios from '../../utils/axios';

//
export function getImageTextList(params) {
  return axios.get('/tweet/image-text-group', { params });
}

// 查询图文列表
export function getImageTextNotRichList(params) {
  return axios.get('/tweet/image-text-group-not-rich', { params });
}

//
export function addImageText(params) {
  return axios.post('/tweet/image-text', params);
}

//保存临时推文
export function savePreviewImageText(params) {
  return axios.post('/tweet/tweet/temp', params);
}

//预览推文
export function PreviewImageText(params) {
  return axios.post(`/tweet/tweet/preview/custom/${params.id}`, params);
}

//微信预览推文
export function PreviewWechatImageText(params) {
  return axios.post(`/tweet/tweet/preview/wechat/${params.id}`, params);
}

//
export function getImageTextById(params) {
  return axios.get(`/tweet/image-text/${params.id}`);
}

//
export function updateImageText(params) {
  return axios.put(`/tweet/image-text/${params.id}`, params.ImageTextList);
}

//
export function deleteImageText(params) {
  return axios.delete(`/tweet/image-text-group/${params.id}`);
}
