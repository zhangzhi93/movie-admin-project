import { getTweetAuditingList, getTweetAuditingNotRichList, addMaterialGroupSend, auditStoreTweets, tempEidtStoreTweets, auditTweet, getTweetAuditRecordById, getTweetAuditRecordNotRichById, getPreviewTweetRecordByIdInfo, getPreviewTweetRecordById, updateTweetAudit, deleteTweetsById } from '../../services/Tweets/auditing';

export default {
  namespace: 'auditing',

  state: {
    loading: false,
    getTweetAuditingListData: {
      content: [],
      last: true,
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 0
    },
    getTweetAuditingNotRichListData: {
      content: [],
      last: true,
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 0
    },
    getTweetAuditRecordByIdData: {},
    getPreviewTweetRecordByIdData: {}
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const pathname = location.pathname;
        if (pathname === '/System') {
        }
      });
    },
  },

  effects: {
    // 查询推文列表、审核列表（含所有字段）
    *getTweetAuditingList({ payload, callback }, { call, put }) {
      const { data } = yield call(getTweetAuditingList, payload);
      if (data && data.status === 0) {
        yield put({ type: 'save', payload: { getTweetAuditingListData: data.data } });
        if (callback) callback(data);
      }
    },
    // 查询推文列表、审核列表（不含富文本）
    *getTweetAuditingNotRichList({ payload, callback }, { call, put }) {
      const { data } = yield call(getTweetAuditingNotRichList, payload);
      if (data && data.status === 0) {
        yield put({ type: 'save', payload: { getTweetAuditingNotRichListData: data.data } });
        if (callback) callback(data);
      }
    },
    //查询审核通过的图文和图片
    *getTweetAuditingContentList({ payload: { auditStatus, tweetType }, callback }, { call, put }) {
      const [imageText, image] = yield [
        call(getTweetAuditingList, { auditStatus, tweetType: tweetType[0] }),
        call(getTweetAuditingList, { auditStatus, tweetType: tweetType[1] }),
      ];
      if (callback) callback(imageText.data, image.data);
    },
    *addMaterialGroupSend({ payload, callback }, { call }) {
      const { data } = yield call(addMaterialGroupSend, payload);
      if (callback) callback(data);
    },
    // 提交审核
    *auditStoreTweets({ payload, callback }, { call }) {
      const { data } = yield call(auditStoreTweets, payload);
      if (callback) callback(data);
    },
    // 门店临时保存编辑推文
    *tempEidtStoreTweets({ payload, callback }, { call }) {
      const { data } = yield call(tempEidtStoreTweets, payload);
      if (callback) callback(data);
    },
    // 按id查询审核记录
    *getTweetAuditRecordById({ payload, callback }, { call, put }) {
      const { data } = yield call(getTweetAuditRecordById, payload);
      if (data && data.status === 0) {
        if (callback) callback(data);
        yield put({ type: 'save', payload: { getTweetAuditRecordByIdData: data.data } });
      }
    },
    // 按id查询审核记录（不含富文本）
    *getTweetAuditRecordNotRichById({ payload, callback }, { call, put }) {
      const { data } = yield call(getTweetAuditRecordNotRichById, payload);
      if (data && data.status === 0) {
        if (callback) callback(data);
        yield put({ type: 'save', payload: { getTweetAuditRecordByIdData: data.data } });
      }
    },
    //
    *getPreviewTweetRecordById({ payload, callback }, { call, put }) {
      const { data } = yield call(getPreviewTweetRecordById, payload);
      if (data && data.status === 0) {
        if (callback) callback(data);
        yield put({ type: 'save', payload: { getPreviewTweetRecordByIdData: data.data } });
      }
    },
    //

    *getPreviewTweetRecordByIdInfo({ payload, callback }, { call, put }) {
      const { data } = yield call(getPreviewTweetRecordByIdInfo, payload);
      if (data && data.status === 0) {
        if (callback) callback(data);
        yield put({ type: 'save', payload: { getPreviewTweetRecordByIdInfoData: data.data } });
      }
    },
    // 修改
    *auditTweet({ payload, callback }, { call }) {
      const { data } = yield call(auditTweet, payload);
      if (callback) callback(data);
    },
    //
    *updateTweetAudit({ payload, callback }, { call }) {
      const { data } = yield call(updateTweetAudit, payload);
      if (callback) callback(data);
    },
    //
    *deleteTweetsById({ payload, callback }, { call }) {
      const { data } = yield call(deleteTweetsById, payload);
      if (callback) callback(data);
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
