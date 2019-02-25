import axios from '../../utils/axios';

// 查询推文列表、审核列表（含所有字段）
export function getTweetAuditingList(params) {
  return axios.get('/tweet/tweet', { params });
}

// 查询推文列表、审核列表（不含富文本）
export function getTweetAuditingNotRichList(params) {
  return axios.get('/tweet/tweet-not-rich', { params });
}

// 提交审核
export function auditStoreTweets(params) {
  return axios.post('/tweet/tweet', params);
}

// 门店临时保存编辑推文
export function tempEidtStoreTweets(params) {
  return axios.post('/tweet/tweet/temp-edit', params);
}

//
export function addMaterialGroupSend(params) {
  return axios.post('/message/material-group-send', params);
}

// 按id查询审核记录
export function getTweetAuditRecordById(params) {
  return axios.get(`/tweet/tweet-audit-record/${params.id}`);
}

// 按id查询审核记录（不含富文本）
export function getTweetAuditRecordNotRichById(params) {
  return axios.get(`/tweet/tweet-audit-record-not-rich/${params.id}`);
}

//
export function getPreviewTweetRecordById(params) {
  return axios.get(`/tweet/tweet-news/${params.id}`);
}

//
export function getPreviewTweetRecordByIdInfo(params) {
  return axios.get(`/tweet/news-detail/${params.id}`);
}

//
export function auditTweet(params) {
  return axios.put(`/tweet/tweet-audit/${params.id}`, params);
}

//
export function updateTweetAudit(params) {
  return axios.put(`/tweet/tweet/${params.id}`, params);
}

//
export function deleteTweetsById(params) {
  return axios.delete(`/tweet/tweet/${params.id}`);
}
